# Seek Job Ad Checkout API
## _Calculate the price of an Ad_

This AWS Serverless API will allow you to calculate Ad prices for customers, as well as set new Ad types and set new Discounts for certain customers. 

### Requirements

- Access to the internet.
- A tool capable of sending requests to the API endpoints.

## Dependencies

I used the following npm packages in the app.

| Plugin | README |
| ------ | ------ |
| serverless-framework | For building AWS serverless micro-services |
| aws-sdk | For working with AWS services |
| jest | For unit testing |
| uuid4 | For generating unqiue ids |

### Setting Up

No setup is required as the API is already running in AWS.

### Using the Endpoint

The API URL is `https://clw5k0brs2.execute-api.us-east-1.amazonaws.com/dev/`

There are 3 resource paths you can navigate to: `/sale`, `/ad`, `/discount`.

### Structure of the Request Bodies

`/sale`

```
{
    "companyName": "company1",
    "adType": "Classic Ad",
    "qty": 4
}
```

`/ad`

```
{
    "name": "Classic Ad",
    "price": 299.99,
    "description": "short description of the Ad type."
}
```

`/discount`
- Reduced Price object
```
{
    "companyName": "company1",
    "discountType": "Reduced Price",
    "adType": "Classic Ad",
    "newPrice": 199.99
}
```
- Reduced Charge object
```
{
    "companyName": "company1",
    "discountType": "Reduced Price",
    "adType": "Classic Ad",
    "qtyBought": 3,
    "qtyCharged": 2
}
```

##### Here are some example requests you can make
&nbsp;
`Creating a new Ad`
- For when you want to create a new Ad type.
```
curl --location --request POST 'https://clw5k0brs2.execute-api.us-east-1.amazonaws.com/dev/ad' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Premium Ad",
    "price": 394.99,
    "description": "Same benefits as Standout Ad, but also puts the advertisement at the top of the results, allowing higher visibility"
}'
```
`Creating a new Discount where we Reduce the Price`
- For when you want to create a new Discount for a customer where a certain Ad type will be charged less money to the customer.
- The Discount is specific to the customer name so when you want to calculate the price of an Ad to a customer then the discount will be applied based on the customers name.
```
curl --location --request POST 'https://clw5k0brs2.execute-api.us-east-1.amazonaws.com/dev/discount' \
--header 'Content-Type: application/json' \
--data-raw '{
    "companyName": "Coles",
    "discountType": "Reduced Price",
    "adType": "Classic Ad",
    "newPrice": 169.99
}'
```
`Creating a new Discount where we Reduce the quantity Charged to customer`
- For when you want to create a new Discount for a customer where they buy a certain amount of the ads and you charge them for a smaller quantity.
- The Discount is specific to the customer name so when you want to calculate the price of an Ad to a customer then the discount will be applied based on the customers name.
```
curl --location --request POST 'https://clw5k0brs2.execute-api.us-east-1.amazonaws.com/dev/discount' \
--header 'Content-Type: application/json' \
--data-raw '{
    "companyName": "Coles",
    "discountType": "Reduced Price",
    "adType": "Classic Ad",
    "qtyBought": 4,
    "qtyCharged": 2
}'
```
`Calculating/Creating a new Sale`
- For when you want to calculate the price of Ads for a customer.
- You provide the name of the company, the type of ad they want to buy, and the amount they want to buy.
- If a discount exists for that customer then this will automatically be calculated by the API.
```
curl --location --request POST 'https://clw5k0brs2.execute-api.us-east-1.amazonaws.com/dev/sale' \
--header 'Content-Type: application/json' \
--data-raw '{
  "companyName": "Coles",
  "adType": "Classic Ad",
  "qty": 3    
}'
```
