import sharp from "sharp";
import fs from 'fs'
import { NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

export const resizeToOriginal = async (input: string, imgName: string) => {

    try {

        const { density, width, height } = await sharp(input, { limitInputPixels: 8585550069 }).metadata();

        if (density && height && width && density > 300) {
            if (height > 6000 && width > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: 300 }).toFile(`output/original-${imgName}`)
            } else if (height > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: 300 }).toFile(`output/original-${imgName}`)
            } else if (width > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: 300 }).toFile(`output/original-${imgName}`)
            } else {
                await sharp(input, { limitInputPixels: 8585550069 }).withMetadata({ density: 300 }).toFile(`output/original-${imgName}`)
            }
        } else if (density && height && width && density <= 300) {
            if (height > 6000 && width > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize(width > height ? { width: 6000 } : { height: 6000 }).withMetadata({ density: density }).toFile(`output/original-${imgName}`)
            } else if (height > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize({ height: 6000 }).withMetadata({ density: density }).toFile(`output/original-${imgName}`)
            } else if (width > 6000) {
                await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: 6000 }).withMetadata({ density: density }).toFile(`output/original-${imgName}`)
            } else {
                await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: width, height: height }).withMetadata({ density: density }).toFile(`output/original-${imgName}`)
            }
        }
    } catch (error) {
        throw error;
    }
}

export const resizeToMedium = async (input: string, imgName: string) => {

    try {
        const { density, width, height } = await sharp(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density) await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 2), height: Math.floor(height / 2) }).withMetadata({ density: density }).toFile(`output/medium-${imgName}`)

    } catch (error) {
        throw error;
    }
}
export const resizeToSmall = async (input: string, imgName: string) => {

    try {
        const { density, width, height } = await sharp(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density) await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 4), height: Math.floor(height / 4) }).withMetadata({ density: density }).toFile(`output/small-${imgName}`)

    } catch (error) {
        throw error;
    }
}

export const resizeForProductPage = async (input: string, imgName: string) => {

    try {
        const { density, width, height } = await sharp(input, { limitInputPixels: 8585550069 }).metadata();
        const { width: logoWidth, height: logoHeight } = await sharp('assets/logo.png', { limitInputPixels: 8585550069 }).metadata();
        if(!logoHeight || !height ||  !width || !logoWidth) return;
        
        const nWidth = Math.floor(width / 8);
        const nHeight = Math.floor(height / 8);
        await sharp('assets/logo.png', { limitInputPixels: 8585550069 }).resize((logoHeight >= nHeight || (logoWidth >= nWidth)) ? { width: nWidth , height: nHeight } : { width: logoWidth, height: logoHeight, }).toFile(`assets/recused-logo.png`);
        await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: Math.floor(width / 8), height: Math.floor(height / 8) }).composite([{ input: 'assets/recused-logo.png', gravity: "center", }]).withMetadata({ density: 72 }).toFile(`output/productPage-${imgName}`)

    } catch (error) {
      throw error;
    }
}
export const resizeForThumbnail = async (input: string, imgName: string) => {

    try {
        const { density, width, height } = await sharp(input, { limitInputPixels: 8585550069 }).metadata();
        if (width && height && density) await sharp(input, { limitInputPixels: 8585550069 }).resize({ width: 150 }).withMetadata({ density: 72 }).toFile(`output/thumbnail-${imgName}`)

    } catch (error) {
        throw error;
    }
}