export default class UserRequest {
    constructor(user){
        this.name = `${user.firstName} ${user.lastName}`
        this.email = user.email
        this.role = user.role
    }
}