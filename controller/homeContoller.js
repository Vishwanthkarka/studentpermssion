const BigPromise = require("../middlewares/bigpromise")

exports.home = BigPromise(async(req,res)=>  {
    res.status(200).json({
        success:true,
        greeting:"Hello from API"
    })
}
)


exports.HomeDummary = (req,res)=>  {
    res.status(200).json({
        success:true,
        greeting:"This is some text"
    })
}
