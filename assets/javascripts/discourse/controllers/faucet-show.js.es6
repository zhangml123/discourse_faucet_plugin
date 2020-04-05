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
	serviceStatus: {"running":true},
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
      "addressValidation.failed",
      "addressLimitValidation.failed",
      "submited"
    )
	receiveDisabled() {
		console.log(this.currentUser)
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
		console.log("addressValidation")
		this.addressLimitValidation = null;
		const address = this.address;
		if (isEmpty(address)) {
	        return EmberObject.create({
	          failed: true
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
			this.set("submited", true);
			this.set("loading", true);
			console.log("click claim")
			console.log(this.currentUser)

			this.set("isClaimTip",false);
		  	this.set("claim_tip","")
		  	this.set("claim_tip_style","color:#e45735;font-size:14px")

			if(!this.currentUser){
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
						this.set("address", this.address);
						this.set("t_status", "faucet.status.success");
						this.set("claimed_style", "background:#70b603;width:100%");
				  	}
			    });
			}
		}
	}
})