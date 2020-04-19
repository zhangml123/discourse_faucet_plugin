import Component from "@ember/component";
import discourseComputed from "discourse-common/utils/decorators";
export default Component.extend({
	prev:null, //上一页
	next:2, //下一页
	pages:[], //页码
	showStart:true, //显示第一页
	showLast:true, //显示末页
	pagesNum:5,  //显示页面数量
	initPage(){
		let currentPage = this.currentPage;
		let totalPages = this.totalPages;
		let pagesNum = this.pagesNum;
		let pages = []
		let pageLeft = Math.ceil(pagesNum / 2)
		//当前页面为前几页时满足显示页面数量
		if(currentPage < pageLeft){
			pageLeft = currentPage;
		}
		//当前页面为后几页时满足显示页面数量
		console.log("currentPage = "+currentPage)
		console.log("pagesNum = "+pagesNum)
		console.log("pageLeft = "+pageLeft)
		console.log("totalPages = "+totalPages)
		if( currentPage + (pagesNum - pageLeft) >= totalPages){
			pageLeft = pagesNum - (totalPages - currentPage)
		}
console.log("pageLeft1 = "+pageLeft)
		for(let i = 1; i <= pagesNum; i++){
			let page = currentPage - ( pageLeft - i )
			if(page > 0 && page <= totalPages) {
				let type = ""
				if(pageLeft - i == 0) type = "current"
				pages.push({"page": page,"type": type})
			}
		}
console.log("pages = "+pages)

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
		if(totalPages > pagesNum && currentPage + (pagesNum - pageLeft) < totalPages) {
			
			this.set("showLast",true)
		}else{
			this.set("showLast",false)
			console.log("show false")
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