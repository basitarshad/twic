## Pretax Accounts

#### Description
The account list will be populated with multiple accounts i.e. `pretax` and `posttax(normal)` accounts.

Difference between normal account and pretax account:

- Normal twic account is employee benefits programmes that are taxable.
e.g. If company gives you money for gym membership, that amount is taxable.
- Amount in Pretax account is not taxable

**Important to note**
> Pretax is only enabled for user who has `is_cdh_enabled === true` in settings.


##### Some known pretax accounts:
```javascript
export const PRETAX_ACCOUNT_NAMES = Object.freeze({
  TRANSIT: 'Commuter Transit',
  PARKING: 'Commuter Parking',
  FSA: 'FSA',
  HSA: 'HSA',
});
```
1. **Commuter TRANSIT**
    - Can use this for `train tickets, buses etc.`
2. **HSA (Health Savings Account)**
    - Can use for Healthcare related items like doctor's visits
3. **FSA (Flexible spendings Account)**
    - Can use for Healthcare related items like doctor's visits


#### Api Documentation
To manage these accounts we are using third party service i.e. Alegeus service

Api documentation for all pretax accounts can be accessed from here https://documenter.getpostman.com/view/5679452/SzmiWvia. Every endpoint will be prefixed with `cdh`. e.g. `http://domain/cdh/endpoint`.

##### Get pretax accounts

Api endpoint: `/cdh/accounts`
This api is used in the `New Claim` [screen](https://app.zeplin.io/project/5eb34fd6627ec675bbfa7576/screen/5edffe35757dbbb8dbeb4740/).

The list of wallets will contain both `pretax` and `post-tax` accounts.

Categories for each pretax account are fixed. Please refer to this [asana task](https://app.asana.com/0/1186631906901951/1186635135225590/f) for details
```javascript
// If the selected pretax account it `Commuter`
const commuterCategories = ['Vanpool', 'Bus', 'Subway', 'Streetcar', 'Ferry'];

// If the selected pretax account is other that `Commuter`
const pretaxCategories = ['Dental', 'Medical', 'Pharmacy', 'Vision'];
```

__For Twic Accounts__: Show Categories from `campany_wallet_configuration`.
__For Pretax__: Fixed categories as mentioned above

##### Get dependents

Api endpoint: `/cdh/dependents`
This api is used in the `New Claim` [screen](https://app.zeplin.io/project/5eb34fd6627ec675bbfa7576/screen/5edffe35757dbbb8dbeb4740/) to populate dependents list.
Keep in mind that the list of dependents will only be shown in the case when user has selected a `pretax` account from the `accounts` list on new claim screen.

#### Dependents
For pretax accounts we can make a claim using `dependent`

Dependents belong to a person not a particular account.
 - User will have accounts
 - User can also have dependents
 - Dependents can use money from user's accounts.
`/cdh/dependents`
Pretax accounts 
