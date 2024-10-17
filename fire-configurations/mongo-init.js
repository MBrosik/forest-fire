db.createUser(
    {
        user: "confUser",
        pwd: "confPwd",
        roles: [
            {
                role: "readWrite",
                db: "configurations"
            }
        ]
    }
)