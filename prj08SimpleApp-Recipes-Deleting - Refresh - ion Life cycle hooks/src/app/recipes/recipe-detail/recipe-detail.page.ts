import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Recipe } from '../recipe.model';

import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe;

  constructor(private activatedRoute: ActivatedRoute, private recipesService: RecipesService, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    //this is observables
    this.activatedRoute.paramMap.subscribe(parmMap => {
      if(!parmMap.has('recipeId')){
        //redirect
        this.navigateToRecipes();
        return;
      }
      const recipeId = parmMap.get('recipeId');

      this.recipe = this.recipesService.getRecipe(recipeId);

      if(!this.recipe || !this.recipe.id){
        this.navigateToRecipes();
        return;
      }
    });
  }

  navigateToRecipes(){
    this.router.navigate(['/recipes']);
  }

  onRecipeDelete(){
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete the recipe',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'delete',
          handler: () => {
            //delete the recipe
            this.deleteTheRecipe();
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  deleteTheRecipe(){
    this.recipesService.deleteRecipe(this.recipe.id);
    this.router.navigate(['/recipes']);
  }

}
