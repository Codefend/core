import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  Ox2 = "Codefend";

  Ox1() {
    console.log("clicked!");
  }
}
