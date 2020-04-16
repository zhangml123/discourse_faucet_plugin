import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
export default Component.extend({
	prev:null,
	next:2,
	pages:[],
	prevEllipsis:null,
	nextEllipsis:null,
	showStart:true,
	showLast:true,
	pagesNum:5, 
	initPage(){
		let currentPage = this.currentPage;
		let totalPages = this.totalPages;
		let pagesNum = this.pagesNum;
		let pages = []
		let pageLeft = Math.ceil(pagesNum / 2)
		if(currentPage < pageLeft){
			pageLeft = currentPage;
		}
		if(currentPage + (pagesNum - pageLeft) >= totalPages){
			pageLeft = pagesNum - (totalPages - currentPage)  ;
		}
		for(let i = 1; i <= pagesNum; i++){
			let page = currentPage - ( pageLeft - i )
			if(page > 0 && page <= totalPages) {
				let type = ""
				if(pageLeft - i == 0) type = "current"
				pages.push({"page": page,"type": type})
			}
		}


		if(currentPage - pageLeft > 0) {
			this.set("showStart",true)
		}else{
			this.set("showStart",false)
		};

		if(currentPage > 1 ) {
			this.set("prev",currentPage - 1)
		}else{
			this.set("prev",null)
		};
		
		if(currentPage < totalPages) {
			this.set("next",currentPage + 1)
		}else{
			this.set("next",null)
		};
		if(currentPage + pageLeft - 1 < totalPages) {
			this.set("showLast",true)
		}else{
			this.set("showLast",false)
		};
		this.set("pages",pages);

	},
	didInsertElement() {
		this._super(...arguments);
		this.initPage();
	},
	actions: {
		changePage(page){
			this.set("currentPage",page)
			this.action(page);
			this.initPage()
		}
	}
	
})