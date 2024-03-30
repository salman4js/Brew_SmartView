import React from "react";
import AppHeader from "../../Assets/logo512.png";

export function appStartupTemplate(options){
    return (
        <div>
            <div>
                <div className='container text-center'>
                    <div className='heading-div2'>
                        <div className="heading-top">
                            <img src={AppHeader} width="300" height="30" className="d-inline-block align-top" alt=""/>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className='text-center'>
                        <div className="loginSection text-center">
                            <form className = 'login-form-view'>
                                <div className="form-group">
                                    {options.formView && options.formView()}
                                </div>
                                <br/>
                                <br/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};