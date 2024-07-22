const CustomError = require('../errors')

const checkPermissions = (reqUser, resourceUserId)=> {
    if(reqUser.role === 'admin') return
    if(reqUser.userId === resourceUserId.toString()) return
    throw new CustomError.Authorized('Authorized to access route!')
}

module.exports = checkPermissions