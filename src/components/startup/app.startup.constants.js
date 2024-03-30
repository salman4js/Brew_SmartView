var AppStartupConstants = Object.freeze({
    fieldValue: {
        username: {
            placeholder: 'Property Name',
            name: 'username',
            width: '350px',
            inlineToastColor: 'white'
        },
        password: {
            placeholder: 'Password',
            name: 'password',
            width: '350px',
            type: 'password',
            inlineToastColor: 'white'
        },
        singIn: {
            value: 'Sign In'
        }
    },
    blockActionsMessage: 'Authenticating...',
    configFetchError: 'Error while fetching the config, please try again!'
});

export default AppStartupConstants;