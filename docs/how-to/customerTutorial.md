We will help you request and pay a loan as a customer without UI.

**Resources**:

- [API Postman](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/collection/31279199-48457e12-af79-4c03-8213-5d053e426487)
- As some initial data has been provided, you can also use the following resources and directly go step 3.:

  - userCustomerId: `661f140fc3fdd12fa39c2faa`
  - loanApprovedId: `661f140fc3fdd14fa39c2fa9`
  - loanPaidId: `661f150fc3fdd14fa39c2fa9`

**Important**: Go to the API Postman and select an environment (probably Docker Local if you run the demo)

1. Sign up as customer if it's your first time on the app since its creation.

```JSON
// Body
{"name":"YourName", "email": "YourEmail", "role": "CUSTOMER"}
```

2. Save your customerId (let's say it's your login)
3. You can see all your loan on the endpoint [Get Loan For customer](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-097c0502-abfd-4fb6-ad64-038cb543e41d) by providing your `customerId`.
4. Save the loanId you've created
5. [Request a loan](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-4ff07b2b-60cf-4bf7-ae94-29170dc378c6) with the following body:

```JSON
{"startDate":"2024-02-17T12:00:00Z", "customerId": "YourCustomerId", "amount": "3000", "term": "2"}
```

6. Retrieve your loans with the previous endpoint [Get Loan For customer](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-097c0502-abfd-4fb6-ad64-038cb543e41d) (step 3) and get the id of your repayments to pay them.
7. To pay a repayment, use the endpoint [Pay a Repayment](https://www.postman.com/cryosat-astronaut-14351547/workspace/apire-mini-app/request/31279199-49f26fbe-1b4b-4b9c-9804-b9e0b5d8e0ef) with the correct amount in the body.
