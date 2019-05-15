import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ShortNumberPipe } from "./short-number.pipe";
import { ThousandSuffixesPipe } from "./thousand-suffixes.pipe";

@NgModule({
  declarations:[ShortNumberPipe, ThousandSuffixesPipe], // <---
  imports:[CommonModule],
  exports:[ShortNumberPipe, ThousandSuffixesPipe] // <---
})

export class MainPipe{}