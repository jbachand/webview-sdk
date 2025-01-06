# Webview SDK

This is a webview sdk for IOS and Android webviews to consolidate the source of truth for data across web and native platforms without writing conditional logic. It bubbles up storage to the highest level of


## Javascript

Include this JS project to yours and an instance of the SDK will be generated at: window.wvSDK

Available Methods:

 - .getUser().then(user)=>{})
 - .storage.get('key').then((string)=>{})
 - .storage.set('key', 'value')

Additionally you can set up watchers:
 - .on('eventName', (data)=>{})

And execute changes by running js from the host native code:
 - .trigger('eventName',{})

## IOS

Implement into your wkwebview as a WKScriptMessageHandlerWithReply:

  

    func  userContentController(_  userContentController: WKUserContentController, didReceive  message: WKScriptMessage) async  -> (Any?, String?) {
    
    if message.name  ==  "SystemAPI" {
	    guard let dictionary  =  message.body  as? [String: AnyObject],
	    let  command  =  dictionary["command"] as?  String  else {
		    return (["error":"not recognized"], nil)
	    }
    
	    switch  command {
		    case "setStorage":
			    guard  let  key  =  dictionary["key"] as?  String,
			    let  value  =  dictionary["value"] as?  String  else {
				    return (["error":"not recognized"], nil)
			    }
	    
			    UserDefaults.standard.set(value, forKey: key)
			    return (value, nil)
	    
		    case  "getStorage":
			    guard  let  key  =  dictionary["key"] as?  String  else {
				    return (["error":"not recognized"], nil)
			    }
	    
		    	    let  data  =  UserDefaults.standard.string(forKey: key)
		    	    return (data, nil)
	    
		    case  "getUser":
			    let  userData: [String : Any] = ["id":"", "email": "", "isAuthed":false, "isPro":false]
			    return (userData, nil)
	    
		    case  "init":
			    return ("", nil)
	    
		    default:    
			    return (["error":"not recognized"], nil)
		    }
	    }
	    return ([:], nil)
    }

 


## Android

Coming soon

