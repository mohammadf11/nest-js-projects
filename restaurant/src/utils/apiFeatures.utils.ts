const nodeGeoCoder = require('node-geocoder');
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { JwtService } from '@nestjs/jwt/dist';

export default class APIFeatures {
  static async getRestaurantLocation(address) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };
      const geoCoder = nodeGeoCoder(options);
      const loc = await geoCoder.geoCoder(address);

      const location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
      };
      return location;
    } catch (error) {
      console.log(error);
    }
  }

  static async uploadImages(files) {
    const s3 = new S3Client({
      region: 'default',
      endpoint: process.env.ARVAN_ENDPOINT,
      credentials: {
        accessKeyId: process.env.ARVAN_ACCESS_KEY,
        secretAccessKey: process.env.ARVAN_SECRET_KEY,
      },
    });

    const imagesKey = [];
    try {
      for (const file of files) {
        const splitFile = file.originalname.split('.');
        const random = Date.now();

        const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;

        const uploadParams = {
          Bucket: process.env.ARVAN_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        };

        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log(data);
        imagesKey.push({
          Url: process.env.ARVAN_STORAGE_URL + uploadParams.Key,
          Key: uploadParams.Key,
          Bucket: process.env.ARVAN_BUCKET_NAME,
        });
      }
      return imagesKey;
    } catch (err) {
      console.error('Error uploading images:', err);
      throw err;
    }
  }

  static async deleteImages(images) {
    const s3 = new S3Client({
      region: 'default',
      endpoint: process.env.ARVAN_ENDPOINT,
      credentials: {
        accessKeyId: process.env.ARVAN_ACCESS_KEY,
        secretAccessKey: process.env.ARVAN_SECRET_KEY,
      },
    });

    try {
      for (const img of images) {
        console.log({
          Bucket: img.Bucket,
          Key: img.Key,
          img: img,
        });
        await s3.send(
          new DeleteObjectCommand({
            Bucket: img.Bucket,
            Key: img.Key,
          }),
        );
      }
      return true;
    } catch (err) {
      console.error('Error uploading images:', err);
      throw err;
    }
  }

  static async assignJwtToken(
    userId: string,
    jwtService: JwtService,
  ): Promise<string> {
    const payload = { id: userId };
    const token = await jwtService.sign(payload);
    return token;
  }
}
