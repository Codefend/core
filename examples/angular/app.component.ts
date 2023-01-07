import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  l_name = "Codefend";

  f_onClick() {
    console.log("clicked!");
  }
}
