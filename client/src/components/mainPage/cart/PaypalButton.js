import React from 'react';
import PaypalBtn from 'react-paypal-checkout';
 
export default class PaypalButton extends React.Component {
    render() {		
        const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            console.log("The payment was succeeded!", payment);

            this.props.tranSuccess(payment)

        }		
 
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);

        }	
 
        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);		
        }			
 
        let env = 'sandbox'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state  
        let total = this.props.total;  // same as above, this is the total amount (based on currency) to be 
        let locale = 'en_US'; 
        // For Customize Style: https://developer.paypal.com/docs/checkout/how-to/customize-button/
        let style = {
            'label':'pay', 
            'tagline': false, 
            'size':'medium', 
            'shape':'pill', 
            'color':'blue',
        };
 
        const client = {
        sandbox:    'Aa-sx1QDk7cINUCT96K7lqHL6lvIx0PFcCEF3golIU5-R7nDKOgjq_CyKqqwB4J9wPbP3VbSvuqTQHGA',
        production: 'YOUR-PRODUCTION-APP-ID',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"): 
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/		
 
        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!		  

        return (
            <PaypalBtn 
                env={env} 
                client={client} 
                currency={currency} 
                total={total} 
                locale={locale} 
                style={style}
                onError={onError} 
                onSuccess={onSuccess} 
                onCancel={onCancel} />
        );
    }
}