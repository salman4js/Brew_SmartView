import React from "react";
import {Triangle} from "react-loader-spinner";

export function templateHelpers(options){
  if(options?.defaultTemplate){
      return (
          <div className="d-flex align-items-center justify-content-center">
              <div className="top-align">
                  <Triangle
                      height="150"
                      width="250"
                      radius="20"
                      color="white"
                      ariaLabel="loading"
                      wrapperStyle
                      wrapperClass
                  />
                  <p className="text-center loading-message">{options.message}</p>
              </div>

          </div>
      )
  } else {
      return (
          <div className='loader-body-field'>
              <div className="loader-field"></div>
          </div>
      )
  }
};