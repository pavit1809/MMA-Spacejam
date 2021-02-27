const mongoose=require('mongoose');

const facilitySchema=mongoose.Schema({
      FacilityName:{
            type:String,
            required:true,
            trim:true
      },
      CapacityperSlot:{//30 min is the slot time
            type:Number,
            required:true
      },
      Price:{
            type:Number,
            required:true
      },
      SlotAvailability:[//starttime and endtime will be derived from center data
            {
                  date:{
                        type:String
                  },
                  slotinfo:[{
                        det1:String,
                        det2:Number
                  }]
            }
      ],//fixed size of next 7 working days
      Offdays:[String],//will be derived from the center data
      owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Center',
      }
})

const Facility=mongoose.model('Facility',facilitySchema);

module.exports=Facility;