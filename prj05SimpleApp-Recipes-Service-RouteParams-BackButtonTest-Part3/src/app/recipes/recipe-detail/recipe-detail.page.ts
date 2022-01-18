import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Recipe } from '../recipe.model';

import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe;


  constructor(private activatedRoute: ActivatedRoute, private recipesService: RecipesService) { }

  ngOnInit() {
    //this is observables
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('recipeId')){
        //redirect
        return;
      }
      const recipeId = parmMap.get('recipeId');

      this.recipe = this.recipesService.getRecipe(recipeId);
    });
  }

}
