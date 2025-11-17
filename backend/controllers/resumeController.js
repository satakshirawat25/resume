import Resume from "../models/resumeModels";
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

export const createResume = async(req,res)=>{
    try{
        const {title} = req.body;

        //Dummy template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

const newResume = await Resume.create({
    userId:req.user._id,
    title,
    ...defaultResumeData,
    ...req.body
})
res.status(201).json(newResume)

    }catch(error){
        res.status(500).json({message:"Failed to create resume",error:error.message})
    }
}


//Get function

export const getUserResumes = async(req,res)=>{
    try{
        const resumes = await Resume.find({userId:req.user._id}).sort({
            updatedAt : -1
        })
        res.json(resumes)
    }catch(error){
        res.status(500).json({message:"Failed to create resumes",error:error.message})

    }
}

//get resume by id
export const getResumeById = async(req,res)=>{
    try{
        const resume = await Resume.findOne({_id:req.params.id,userID:req.user._id})

        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }
        res.json(resume)

    }catch(error){
        res.status(500).json({message:"Failed to create resume",error:error.message})
    }
}


//updated resumes
export const updateResume = async(req,res)=>{
    try{
        const resume = await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id
        })
        if(!resume)
        {
            return res.status(404).json({message:"Resume not found"})
        }

        //merge updated resume

        Object.assign(resume,req.body)

        //Save updated resume

        const savedResume=await resume.save()
        res.json(savedResume)
    }catch(error){
        res.status(500).json({message:"Failed to update resume",error:error.message})
    }
}

//Delete resume

export const deleteResume = asyc(req,res)=>{
    try{
        const resume = await Resume.findOne({
            _id:req.params.id,
            userId:req.user._id
        })
        if(!resume)
        {
            return res.status(404).json({message:"Resume not found"})
        }


        //create a uploads folder and store te resume there
        const uploadsfolder = path.join(process.cmd(),'uploads')

        //Delete thumbnail function
        if(resume.thumbnailLink){
            const oldThumbnail = path.join(uploadsfolder,path.basename(resume.thumbnailLink))
            if(fs.existsSync(oldThumbnail)){
                fs.unlinkSync(oldThumbnail)
            }
        }

        if(resume.profileInfo?.profileProvidedUrl){
            const oldProfile = path.join(
                uploadsfolder,
                path.basename(resume.profileInfo.profileProvidedUrl)
            )
            if(fs.existsSync(oldProfile)){
                fs.unlinkSync(oldProfile)
            }
        }

        //Delete resume Doc
        const deleted = await Resume.findOneAndDelete({
            _id:req.params.id,
            userId:req.user._id
            
            
        })
        if(!deleted)
        {
            return res.status(404).json({message:"Resume not found or not authorized"})
        }
        res.json({message:'Resume deleted successfully'})

    }catch(error){
        res.status(500).json({message:"Failed to update resume",error:error.message})
    }
}