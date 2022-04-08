import { VendorsHelpers } from '../index';
import { userProfileFormattedData } from '../__mock__/user.mock';
import {formattedVendor, productId, formatProductVendor, formatVendorProductId, formatProductDetails, formattedHowToAccessProducts, formattedProductFromVendor} from '../__mock__/vendors.mock';

describe('vendors.ts', () => {
  it('Get product image', () => {
    const response = VendorsHelpers.getProductImage(formattedVendor, productId);
    expect(response).toBe("https://s3-us-west-1.amazonaws.com/twic.ai/vendor_assets/24_hour_fitness/24hourfit_product_1.png")
  })

  it('Get product details', () => {
    const response = VendorsHelpers.getProductDetails({
        vendor: formatProductVendor,
        productId: formatVendorProductId, 
        userProfile: userProfileFormattedData });
    expect(response).toEqual(formatProductDetails)
  })

  it('Get how to access specification products', () => {
    const response = VendorsHelpers.getHowToAccessForSpecificProduct(
        formattedVendor,
        productId, );
    expect(response).toEqual(formattedHowToAccessProducts)
  })

  it('Find product from vendor', () => {
    const response = VendorsHelpers.findProductFromVendor(
        {
          vendor: formattedVendor,
          productId
      });
    expect(response).toEqual(formattedProductFromVendor)
  })
})
