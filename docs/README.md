# Context

## Test-case (reminder)

It is an app that allows authenticated users to go through a loan application. It doesn’t have to contain too many fields, but at least “amount required” and “loan term.” All the loans will be assumed to have a “weekly” repayment frequency.

After the loan is approved, the user must be able to submit the weekly loan repayments. It can be a simplified repay functionality, which won’t need to check if the dates are correct but will just set the weekly amount to be repaid.

[Actions to implement](./images/Screenshot%202024-04-19%20at%2016.54.07.png)

## Assumptions

I've made some assumptions during the test-case:

- If a customer pays more that required a repayment, the excess paid is lost
- Loan term frequency: 1 term every week after the start of the loan

# Technical spec

## Event-driven platform

I've decided to opt for an event driven platform architecture for the test-case.

The concept is simple, we have services which do their jobs and produce business events, while other services subscribe to the events of their choice, and consume their data.
I didn't implement it, but I simulated it with logs messages.
One well-known event-driven platform system is kafka.

This architecture enables the decoupling of the services (more resiliency), even if you're mostly dependant of a unique system (you're in trouble if the system fails).
Moreover, as the business events can take time (an admin will not instantly approve a loan), we don't rely on the performances of such a system.
It also offers resiliency by providing idempotency.

Please find [more details](./design/event-platform.md) of the events produces of the test-case, and the consumers.

## Data model and DB

I think that the best would have been to work with a relational database system such as PostgreSQL (wide range of data type and good performances). However, I chose to implement a mongo DB for the test-case (NoSQL) as I know better the technology and had few days to implement the app.

Please find [more details](./design/data-model.md) to check the data model.

# Going further...

Please find some ideas to improve the application.

## 1. Resiliency

In order to have less maintenance and reduce incident, I think it's very important to consider the resiliency of the application.

- Add retry functions around each server call
- Check the idempotency of workflows so that we can easily retry them in case of failure.
  For instance, let imagine we don't have an event platform system, and that we trigger synchronusly the call to the different services in a function. If one call fails, I should be able to retry the function without reprocessing the services already called.
- Integration tests
- Switching to PostgreSQL DB would be better (for schemas and data consistency)
- Create a CI and implement tests (unit and integrations)
- Add a logger, traces, alerting and SLOs

## 2. Security

- Add authentification (with password), and handle it with tokens
- Maybe use libraries / framework to handle authentification
- Remove Id from the response, it is just here for the demo
- Use a secret manager for DB access

## 3. DevExp

- Install a linter in the project
- Install a MonoRepo manager (NX for instance)
- Work on builds so that it erase the whole dist folder before rebuilding
- Module handling: NestJS is a good JS framework to handle dependency injection of services

## 4. Other

- Performance: add index to the DB
- Create environments (production & staging)
