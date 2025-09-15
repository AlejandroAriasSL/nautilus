import { Injectable } from "@src/decorators";

@Injectable
export default class InjectedFoo {
  doSomething() {
    console.log("im injected hehe");
  }
}
