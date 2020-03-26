import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
export default Ember.Controller.extend({
	addressAvailable: false,
	exceeded: false,
	address : "",
	@discourseComputed(
      "exceeded",
      "addressValidation.failed"
    )
	receiveDisabled() {
		console.log("receiveDisabled " )
		if(this.get("addressValidation.failed")) return true;
		if(this.exceeded) return true;
		if (this.isExceeded) return true;
		console.log("receiveDisabled= false ")
		return false;
	},
	@discourseComputed("address")
	addressValidation() {
		if(this.address != "" && (this.address.length == "5")){
			console.log("this.address.length = 5 ")
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("address.ok")
	        });	
		}
			console.log("this.address.length != 5 ")

		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("address.invalid")
	    });
	},
	isExceeded() {
		console.log(this.siteSetting)

		
		return true
	},
	
	actions: {

		claim(){
			console.log("click claim")
			console.log(this.currentUser)
			if(!this.currentUser){
				this.send("showLogin");
			}else{

				ajax("/faucet/claim",{
					type: "POST",
					data: {address : this.address}
				}).then(result => {
			      console.log("result = ")
			      console.log(result)
			      
			     
			    });
			}
		    
		}
	}

  
})