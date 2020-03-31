import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { isEmpty } from "@ember/utils";
export default Ember.Controller.extend({
	addressAvailable: false,
	exceeded: false,
	daily_limit : Discourse.SiteSettings.faucet_daily_limit,
	user_limit : Discourse.SiteSettings.faucet_user_limit,
	address : "",
	serviceStatus: {"running":true},
	submited:false,
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	balanceImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/balance.svg"),
	availableImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/available.svg"),
	statusbleImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/status.svg"),
	
	@discourseComputed(
      "isExceeded.failed",
      "addressValidation.failed",
      "submited"
    )
	receiveDisabled() {
		console.log(this.currentUser)
		if(!this.currentUser) return false;
		if(this.get("addressValidation.failed")) return true;
		if(this.get("isExceeded.failed")) return true;
		if(this.get("isBalance.failed")) return true;
		if(this.submited) return true;
		return false;
	},
	@discourseComputed("address")
	addressValidation() {
		const address = this.address;
		if (isEmpty(address)) {
	        return EmberObject.create({
	          failed: true
	        });
	      }
		if(address != "" && (address.length == "42") && (address.substring(0,2) == "0x")){
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("faucet.address.ok")
	        });	
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("faucet.address.invalid")////地址错误
	    });
	},
	isExceeded() {
		if(this.get("model").amount >= user_limit) {
			console.log("amount ok")
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("faucet.amount.ok")
	        });	
		}else{
			
			this.serviceStatus = {"suspend": true}
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("faucet.amount.invalid")////今日领取余额不足
	    });
	},
	isBalance() {
		if(this.get("model").balance >= user_limit) {
			console.log("faucet.balance ok")
			return EmberObject.create({
	          ok: true,
	          reason: I18n.t("faucet.balance.ok")
	        });	
		}else{
			
			this.serviceStatus= {"down" : true}
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("faucet.balance.invalid")////水龙头余额不足
	    });
	},
	actions: {
		claim(){
			this.submited = true;
			console.log("click claim")
			console.log(this.currentUser)
			if(!this.currentUser){
				this.send("showLogin");
			}else{

				ajax("/faucet/claim",{
					type: "POST",
					data: {address : this.address}
				}).then(result => {
				  this.submited = false;
			      console.log("result = ")
			      console.log(result)
				  $("#claim_tip").html(result.message)
			      if(result.success){
			      	setTimeout(fucntion(){
			      		window.location.href="/faucet"
			      	},2000)
			      }
			    });
			}
		}
	}
})