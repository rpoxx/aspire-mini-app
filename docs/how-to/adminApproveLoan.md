We will help you approve a loan as an admin without UI.

**Resources**:

- [API Postman](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/collection/31279199-48457e12-af79-4c03-8213-5d053e426487)
- As some initial data has been provided, you can also use the following resources and directly go step 4.:

  - `userAdminId`: 661f140fc3fdd12fa39c2fbb
  - `loanPendingId`: 661f130fc3fdd13fa39c2fa9
  - `loanApprovedId`: 661f140fc3fdd14fa39c2fa9
  - `loanPaidId`: 661f150fc3fdd14fa39c2fa9

**Important**: Go to the API Postman and select an environment (probably Docker Local if you run the demo)

1. Sign up as admin if it's your first time on the app since its creation.

```JSON
// Body
{"name":"YourName", "email": "YourEmail", "role": "ADMIN"}
```

2. Save your adminId (let's say it's your login)
3. Retrieve the token identification to Approve by using the endpoint [authentificate](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-555b72a8-4e78-4a0e-958b-484ad7ee90dd) with your `userAdminId`
4. [Approve a pending loan](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-a8326d58-099f-45b8-93dc-1a701ebb4081) with the token in the Authorization header (Bearer Authorization).
5. If you can check the loan state by using the endpoint [Get Loan](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-15345553-4c5e-4e81-b330-055e651d4e3d) with the id of your loan
