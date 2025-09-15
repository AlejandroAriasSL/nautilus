import { Injectable } from "@src/decorators";
import Autowired from "@src/decorators/Autowired";
import InjectedFoo from "./InjectedFoo";

@Injectable
export default class Foo {
  @Autowired
  injectedFoo: InjectedFoo;

  doSomething() {
    this.injectedFoo.doSomething();
  }
}
