export default class webviewSDK{
    Platforms = Object.freeze({
      IOS:   "_ios",
      ANDROID:  "_android",
      WEB: "_web"
    });
    platform = this.Platforms.WEB
  
    constructor(){
      this.#_setWindow()
      this.eventListeners = {};
    }
  
    async getUser(){
      return await this[this.platform]('getUser')
    }
    storage = {
      get:
        async (key)=>{
          return await this[this.platform]('getStorage', {key})
        }, 
      set:
        async (key, value)=>{
          return await this[this.platform]('setStorage', {key, value})
        }
    }

    on = (eventName, callback) => {
      if (!this.eventListeners[eventName]) {
        this.eventListeners[eventName] = [];
      }
      this.eventListeners[eventName].push(callback);
    }
  
    trigger = (eventName, ...args) => {
      if (this.eventListeners[eventName]) {
        this.eventListeners[eventName].forEach(callback => {
          callback(...args);
        });
      }
    }
  
    _ios =  function(command, message={}) { 
      return window.webkit?.messageHandlers?.SystemAPI.postMessage({"command": command, ...message})
    }

    _android =  function(command, message={}) {
      return window.android?.SystemAPI?.postMessage({"command": command,"data":{...message}})
    }
  
    _web = function(command, message={}) {
      switch (command ){
        case 'getUser':
          return new Promise((complete)=>{
            complete({email:"", isAuthed: false, isPro: false, id:""})
          })
        case 'getStorage':
          if(message?.key){
            return localStorage.getItem(message.key)
          }
        case 'setStorage':
          if(message?.key && message?.value){
            if (typeof message.value !== 'string'){
              message.value = JSON.stringify(message.value)
            }
            localStorage.setItem(message.key, message.value)
            return message.value
          }
      }
    }
  
    #_setWindow = function(){
      if(window.webkit?.messageHandlers?.SystemAPI){
        window.ios = true
        this.platform = this.Platforms.IOS
      } 
      if(window.android){
        window.android = true
        this.platform = this.Platforms.ANDROID
      }
      if(!window.ios && !window.android){
        window.web = true
      }
    }
  
  }

  window.wvSDK =  new webviewSDK()
