import RestModel from "discourse/models/rest";
console.log("faucet-s")

const FaucetHistories = RestModel.extend({
	loadBefore() {

    console.log("faucet-d model")
  },

    /*// refresh dupes
    this.topics.removeObjects(
      this.topics.filter(topic => topic_ids.indexOf(topic.id) >= 0)
    );

    const url = `${Discourse.getURL("/")}${
      this.filter
    }.json?topic_ids=${topic_ids.join(",")}`;

    return ajax({ url, data: this.params }).then(result => {
      let i = 0;
      this.forEachNew(TopicList.topicsFrom(this.store, result), t => {
        // highlight the first of the new topics so we can get a visual feedback
        t.set("highlight", true);
        this.topics.insertAt(i, t);
        i++;
      });

      if (storeInSession) Session.currentProp("topicList", this);
    });
  }*/
  test(){
      console.log("test")

  }
})

export default FaucetHistories;