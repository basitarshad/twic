export type VenueDetailsCardType = {
    userProfile;
    venueDetails;
    customAction?(): void;
    getVendorById?(params): object;
};