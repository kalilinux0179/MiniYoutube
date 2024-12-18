import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
export { uploadOnCloudinary } from "../utils/cludinary.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. get user detail from frontend
    const { userName, email, fullName, password } = req.body;
    // 2. validation - not empty
    if (
        [userName, email, fullName, password].some(
            (field) => field?.trim() === "",
        )
    ) {
        throw new ApiError(400, "All Fields are required");
    }

    // 3. check if user already exists: username and email
    const existedUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existedUser) {
        throw new ApiError(409, "User already exists with email or username");
    }

    // 4. check for image - check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath || !coverImageLocalpath) {
        throw new ApiError(400, "Avatar is required");
    }

    // 5. upload images to cloudinary
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrl = await uploadOnCloudinary(coverImageLocalpath);

    if (!avatarUrl || !coverImageUrl) {
        throw new ApiError(500, "Image upload failed");
    }

    // 6. create and saveuser object
    const user = await User.create({
        userName: userName.toLowerCase().trim(),
        fullName: fullName.toLowerCase().trim(),
        email,
        password,
        avatar: avatarUrl.url,
        coverImage: coverImageUrl?.url,
    });

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken",
    );
    // if not created throw error
    if (!createUser) {
        throw new ApiError(500, "User creation failed");
    }
    // if created send response
    return res
        .status(201)
        .json(new ApiResponse(200, createUser, "User Registered successfully"));
});

export { registerUser };
