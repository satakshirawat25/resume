import mongoose, { mongo } from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    title:{
        type:String,
        required:true
    },
thumbnailLink:{
    type:String,
    },
    template:{
        theme:String,
        colorPalette:[String]
    },
    profileInfo:{
        profileProvidedUrl:String,
        fullName:String,
        designation:String,
        summary:String,
    },
    contactInfo:{
        email:String,
        phone:String,
        location:String,
        github:String,
        website:String,
    },

    //work exp
    workExperience:[{
        company:String,
        role:String,
        startDate:String,
        endDate:String,
        description:String,
    },
],
    education:{
        degree:String,
        institution:String,
        startDate:String,
        endDate:String,
        
    },
    skills:[{
        name:String,
        progress:String
    },],
    projects:[{
        title:String,
        description:String,
        github:String,
        liveDemo:String,
    },],
    certifiations:[
        title:{
            title:String,
            issuer:String,
            year:String,
        },
    ],
    languages:[{
        name:String,
        progress:string,
    },],
    intrests:[String],
},{
    timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}
}
)

export default mongoose.model('Resume',ResumeSchema)