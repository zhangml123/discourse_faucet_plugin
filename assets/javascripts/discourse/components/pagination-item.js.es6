import Component from "@ember/component";
export default Component.extend({
	tagName: "li",
	html:null,
	didInsertElement() {
		this._super(...arguments);
		console.log("this.page")
		console.log(this.page)
		if(this.page == null){
			$(this.element).addClass("pagination-disabled")
		}
		if(this.type == "current"){
			$(this.element).css("color","#ff0000")
		}

		if(this.type == "prev"){
			this.set("html","<<")
		}else if(this.type == "next"){
			this.set("html",">>")
		}else{
			this.set("html",this.page)
		}
	},
	click(){
		if(this.page != null){
			let { action } = this;
			action(this.page);
		}
		

	}

	
})