function isValidateZipcode(input) {
    console.log("isValidateZipcode", input)
    const numericZipcode = input.replace(/-/g, '');
    const numeralZipcodeRegex = /^\d{7}$/;
    console.log("is validate Zip Code response : ", numeralZipcodeRegex.test(numericZipcode));
    return numeralZipcodeRegex.test(numericZipcode)
}

function fetchAddress(zipcode) {
    console.log("fetchAddress : ", zipcode)
    const resp = ZDK.HTTP.request({
        url: 'https://zipcloud.ibsnet.co.jp/api/search',
        method: 'GET',
        parameters: {
            zipcode,
            limit: 1
        }
    }).getResponse();
    return JSON.parse(resp)
}

function getFillAddressParamsByModule(data, mapping = {
    country: "Country",
    state: "State",
    city: "City",
    street: "Street"
}) {
    console.log("getFillAddressParamsByModule : ", JSON.stringify(data),
        JSON.stringify(mapping))
    const formattedData = {}
    formattedData[mapping.country] = '日本';
    formattedData[mapping.state] = data?.address1 ?? '';
    formattedData[mapping.city] = data?.address2 ?? '';
    formattedData[mapping.street] = data?.address3 ?? '';
    return formattedData;
}

// NOTE: Main function
// NOTE: Match the variable name for each argument with the script side.
function fillAddressByZipcode(
    zipcode = "",
    triggerFieldApiName = "",
    mappingObject = {
        country: "Country",
        state: "State",
        city: "City",
        street: "Street"
    }
) {
    console.log("fillingAddressByZipcode : ", zipcode, triggerFieldApiName,
        JSON.stringify(MAPPING_OBJECT))
    const fieldObj = ZDK.Page.getField(triggerFieldApiName);
    console.log("zip code : ", zipcode)
    if (isValidateZipcode(zipcode)) {
        console.log("zip code before replace : ", zipcode);
        zipcode = zipcode.replace(/-/g, '')
        console.log("zip code after replace : ", zipcode);
    } else {
        fieldObj.showError('桁数が不正です');
        return false;
    }
    const address = fetchAddress(zipcode)
    if (address?.results) {
        const fillAddressParams = getFillAddressParamsByModule(address.results[0],
            mappingObject)
        ZDK.Page.getForm().setValues(fillAddressParams)
    } else {
        fieldObj.showError(address?.message ?? 'エラーが発生しました');
        console.log(response)
    }
    return true;
}

/*
// How to use in the script
const zipcode = value;
const triggerFieldApiName = "Zip_Code";
const mappingObject = {
    country: "Country",
    state: "State",
    city: "City",
    street: "Street"
};
resp = fillAddressByZipcode(zipcode, triggerFieldApiName, mappingObject);
*/
