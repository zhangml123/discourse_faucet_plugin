import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";
import { isEmpty } from "@ember/utils";
export default Ember.Controller.extend({
	addressLimitValidation: null,
	checkedAddress:false,
	exceeded: false,
	daily_limit : Discourse.SiteSettings.faucet_daily_limit,
	user_limit : Discourse.SiteSettings.faucet_user_limit,
	address : "",
	submited:false,
	loading:false,
	faucetImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/faucet.svg"),
	balanceImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/balance.svg"),
	availableImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/available.svg"),
	statusbleImageUrl: Discourse.getURL("/plugins/discourse_faucet_plugin/images/status.svg"),
	isClaimTip:false,
	claim_tip:"",
	claim_tip_style:"",
	@discourseComputed(
      "isExceeded.failed",
      "isBalance.failed",
      "addressValidation.failed",
      "addressLimitValidation.failed",
      "submited"
    )
	receiveDisabled() {
		if(!this.get("model").status) return true;
		if(!this.currentUser) return false;
		if(this.get("addressValidation.failed")) return true;
		if(this.get("addressLimitValidation.failed")) return true;
		if(this.get("isExceeded.failed")) return true;
		if(this.get("isBalance.failed")) return true;
		if(this.submited) return true;
		
		return false;
	},
	@discourseComputed("address")
	addressBaseValidation() {
		this.addressLimitValidation = null;
		const address = this.address;
		if (isEmpty(address)) {
	        return EmberObject.create({
	          failed: true
	        });
	     }
	    if(this.get("model").amount < this.user_limit) {
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.amount.invalid")////今日领取余额不足
		    });
		}
		if(this.get("model").balance < this.user_limit) {
			return EmberObject.create({
		        failed: true,
		        reason: I18n.t("faucet.balance.invalid")////水龙头余额不足
		    });
		}
		if(address != "" && (address.length == "42") && (address.substring(0,2) == "0x")){
			this.set("loading", true);
	    	ajax("/faucet/check_address?address=" + address)
			  .then(result => {

			  	this.set("loading", false);
			  	console.log("check_address")
			 if(result.claimed){
			 	console.log(result.claimed)
			 	this.set( "addressLimitValidation",EmberObject.create({
			        failed: true,
			        reason: I18n.t("faucet.address.limit")
			    }) );
			 	
			 }else{
			 	console.log(result.claimed)
			 	this.set( "addressLimitValidation",EmberObject.create({
			        ok: true,
			        reason: I18n.t("faucet.address.ok")
			    }));
			 	
			 }
		    });
			
		}
		return EmberObject.create({
	        failed: true,
	        reason: I18n.t("faucet.address.invalid")////地址错误
	    });
	},
	@discourseComputed("addressBaseValidation","addressLimitValidation")
	addressValidation(){
 		return this.addressLimitValidation ? this.addressLimitValidation : this.addressBaseValidation;
	},
	actions: {
		claim(){
			this.set("submited", true);
			this.set("loading", true);
			this.set("isClaimTip",false);
		  	this.set("claim_tip","")
		  	this.set("claim_tip_style","color:#e45735;font-size:14px")
		  	if(!this.get("model").status) return false;
			if(!this.currentUser){
				this.set("loading", false);
				this.send("showLogin");
			}else{

				ajax("/faucet/claim",{
					type: "POST",
					data: {address : this.address}
				}).then(result => {
				  this.set("submited", false);
				  this.set("loading", false);
			      console.log("result = ")
			      console.log(result)
				  $("#claim_tip").html(result.message)
				  	this.set("isClaimTip",true);
				  	this.set("claim_tip",result.message)
				  	if(result.success) {
				  		this.set("claim_tip_style","color:#70b603;font-size:14px")
						this.set("claimed", true);
						this.set("t_address", this.address);
						this.set("t_status", "faucet.status.success");
						this.set("claimed_style", "background:#70b603;width:100%");
				  	}
			    });
			}
		}
	}
})