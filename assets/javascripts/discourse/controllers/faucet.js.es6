import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
export default Ember.Controller.extend({
	addressAvailable: false,
	exceeded: false,
	daily_limit : Discourse.SiteSettings.faucet_daily_limit,
	user_limit : Discourse.SiteSettings.faucet_user_limit,
	address : "",
	serviceStatus: {"running":true},
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	@discourseComputed(
      "isExceeded.failed",
      "addressValidation.failed"
    )
	receiveDisabled() {
		console.log("receiveDisabled")
		if(this.get("addressValidation.failed")) return true;
		if(this.get("isExceeded.failed")) return true;
		if(this.get("isBalance.failed")) return true;
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
	        reason: I18n.t("address.invalid")////地址错误
	    });
	},
	isExceeded() {
		if(model.amount >= user_limit) {
			console.log("amount ok")
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("amount.ok")
	        });	
		}else{
			
			this.serviceStatus = {"suspend": true}
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("amount.invalid")////今日领取余额不足
	    });
	},
	isBalance() {
		if(model.balance >= user_limit) {
			console.log("balance ok")
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("balance.ok")
	        });	
		}else{
			
			this.serviceStatus= {"down" : true}
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("balance.invalid")////水龙头余额不足
	    });
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