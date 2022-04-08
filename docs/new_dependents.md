#### New Dependent screen
For pretax accounts we can make a claim using `dependent`

##### Current backend implementation
Current backend implementation requires these fields as mandatory:

1. first_name
2. last_name
3. address.line1
4. address.line2
5. address.city
6. shipping_address.line1
7. shipping_address.line2
8. shipping_address.city

Main issue with this implementation is that it does not take `phone` as a required field.
Backend needs to add `phone` as a mandatory field. Backend guys have made a not for that.

**New Requirement**
After talking with Max, only `first_name`, `last_name` and `phone` will be required for adding 
a new dependent. So, required fields will be changed once backend implements it.