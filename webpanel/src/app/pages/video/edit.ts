/*--------------
V 1.0.0 - Criado por Larner Diogo

DESCIÇÃO:
Component administração de categorias da aplicação


COMPONENTS
***********************************************************/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/**********************************************************
SERVICES
***********************************************************/
import { GlobalService } from '../../globals/global';
import { HttpService } from '../../globals/http';
import { AlertService } from '../../globals/alert';
import { StorageService } from './../../globals/storage';
import { SuccessErrorsServices } from '../../globals/sucess.errors';
import { PARAMETERS } from '@angular/core/src/util/decorators';

declare var $: any;
@Component({
  selector: 'app-video-edit',
  templateUrl: './edit.html'
})
export class VideoEditComponent implements OnInit {

  itemCarregado: any = null;
  itemFotoProduto: any = null;

  selectComboCategorias: any;
  selectComboStatus: any;
  selectComboUnidades: any;

  constructor(
    private Router: Router,
    private ActivatedRoute: ActivatedRoute,
    private SuccessErrorsServices: SuccessErrorsServices,
    public GlobalService: GlobalService,
    public HttpService: HttpService,
    public AlertService: AlertService,
    public StorageService: StorageService
  ) {}

  ngOnInit() {
    this.GlobalService.setTituloPage();

    //CARREGANDO DADOS INICIAIS
    this.getItem();
    $(".selectpicker").selectpicker();
  }

  /************
  GET ITEM
  *************/
  getItem() {
    this.ActivatedRoute.params.subscribe(params => {

      let headerConfig = {
        stsValue: "A",
        deleteValue: "N"
      }
      this.HttpService.JSON_GET(`/data/item/depoimentos/${params.id}/*/nome`, headerConfig)
        .then(
        (res) => {

          console.log(res.json());
          this.AlertService.alertLoadingClose();
          if (res.json().length === 0) {
            this.GlobalService.notItens = true;
          } else {
            this.itemCarregado = res.json().data;
            setTimeout(() => {
              $('.selectpicker').selectpicker('refresh');
            }, 150);
          }
        },
        (error) => {
          this.GlobalService.notItens = true;
          this.AlertService.alertError(JSON.parse(error._body));
        })
    })
  }

  /************
  PUT
  *************/
  putItem(form) {
    this.ActivatedRoute.params.subscribe(params => {
      if (form.status === 'INVALID') {
        return this.AlertService.alertInfo(this.SuccessErrorsServices.showError(1001));

      }else{

        //ENVIADO DADOS
        this.GlobalService.inProcessForm = true;
        this.AlertService.alertLoadingShow();

        let headerConfig = {
          stsValue: "A",
          deleteValue: "N"
        }
        this.HttpService.JSON_PUT(`/data/item/depoimentos/${params.id}/*/nome`, headerConfig, form.value)//CADASTRO DE depoimentoS      
          .then(
          (res) => {
            
            Promise.resolve(this.AlertService.alertInfo(res.json().msg))
            .then(() => { this.Router.navigate(['/depoimento/lista']); })

            this.GlobalService.inProcessForm = false;
            form.reset();

          },
          (error) => {
            this.GlobalService.inProcessForm = false;
            this.AlertService.alertError(JSON.parse(error._body));
          })

      }
    })

  }

}
