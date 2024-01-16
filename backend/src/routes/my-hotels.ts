import express, { Request, Response } from "express"
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import Hotel from "../models/hotel"
import verifyToken from "../middleware/auth"
import { body } from "express-validator"
import { HotelType } from "../shared/types"

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

// api/my-hotels
router.post("/", verifyToken, [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').notEmpty().withMessage('Hotel type is required'),
    body('pricePerNight').notEmpty().withMessage('Price per night is required and must be a number'),
    body('facilities').notEmpty().isArray().withMessage('Facilities is required')
], upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[]
        const newHotel: HotelType = req.body

        const imageUrls = await uploadImages(imageFiles)

        newHotel.imageUrls = imageUrls
        newHotel.lastUpdated = new Date()
        newHotel.userId = req.userId

        const hotel = new Hotel(newHotel)
        await hotel.save()

        res.status(201).send(hotel)
    } catch (e) {
        console.log("Error creating hotel: ", e);
        res.status(500).json({ message: 'Something went wrong' })
    }
})

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId })
        res.json(hotels)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotels' })
    }
})

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    const id = req.params.id.toString()
    try {
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId })
        res.json(hotel)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotel' })
    }
})

router.put("/:id", verifyToken, upload.array('imageFiles'), async (req: Request, res: Response) => {
    const id = req.params.id.toString()
    try {
        const updatedHotel: HotelType = req.body
        updatedHotel.lastUpdated = new Date()

        const hotel = await Hotel.findOneAndUpdate({ _id: id, userId: req.userId }, updatedHotel, { new: true })
        if (!hotel) {
            return res.status(404).json({ message: 'hotel not found' })
        }
        const files = req.files as Express.Multer.File[]
        const updatedImagesUrls = await uploadImages(files)

        hotel.imageUrls = [...updatedImagesUrls, ...(updatedHotel.imageUrls || [])]
        await hotel.save()
        res.status(201).json(hotel)
    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: 'Error updating hotel' })
    }
})

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        // console.log('error not here');
        const b64 = Buffer.from(image.buffer).toString('base64')
        // console.log('error before');
        let dataURI = 'data:' + image.mimetype + ';base64,' + b64
        const res = await cloudinary.uploader.upload(dataURI, {}, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        })
        // console.log('error after');
        return res.secure_url
    })

    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls
}

export default router
