import React from "react";

// AddressForm component to collect address information from the user.
//---------------------------------------------------------------------
export const AddressForm = ({ data, onChangeHandler }) => {
  return (
    <div>
      <p className="address-title">Enter your address</p>
      <div className="multi-fields">
        <input
          name="firstName"
          onChange={onChangeHandler}
          value={data.firstName}
          type="text"
          placeholder="First name *"
          required
        />
        <input
          name="lastName"
          onChange={onChangeHandler}
          value={data.lastName}
          type="text"
          placeholder="Last name"
        />
      </div>
      <div className="multi-fields">
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone *"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
      </div>
      <div className="multi-fields">
        <input
          name="streetNumber"
          onChange={onChangeHandler}
          value={data.streetNumber}
          type="text"
          placeholder="Street number *"
          required
        />
        <input
          name="buildingNumber"
          onChange={onChangeHandler}
          value={data.buildingNumber}
          type="text"
          placeholder="Building number *"
          required
        />
      </div>
      <div className="multi-fields">
        <input
          name="zone"
          onChange={onChangeHandler}
          value={data.zone}
          type="text"
          placeholder="Zone"
        />
        <input
          name="city"
          onChange={onChangeHandler}
          value={data.city}
          type="text"
          placeholder="City *"
          required
        />
      </div>
    </div>
  );
};
