import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing implements OnInit {


  lineOne = '';
  lineTwo = '';
  lineThree = '';
  lineFour = '';


  private texts = [
    'Tu negocio no se adapta',
    'al sistema.',
    'Nosotros nos adaptamos',
    'a ti.'
  ];



  constructor(
    private cd: ChangeDetectorRef
  ){}



  ngOnInit(){

    this.startTyping();

  }




  async startTyping(){


    while(true){


      await this.writeLine(
        0,
        this.texts[0]
      );


      await this.writeLine(
        1,
        this.texts[1]
      );


      await this.writeLine(
        2,
        this.texts[2]
      );


      await this.writeLine(
        3,
        this.texts[3]
      );



      await this.wait(3000);



      await this.deleteLine(3);

      await this.deleteLine(2);

      await this.deleteLine(1);

      await this.deleteLine(0);



      await this.wait(1000);


    }


  }






  writeLine(
    line:number,
    text:string
  ){


    return new Promise<void>((resolve)=>{


      let index = 0;



      const interval = setInterval(()=>{


        const character = text[index];



        if(line === 0){

          this.lineOne += character;

        }


        if(line === 1){

          this.lineTwo += character;

        }


        if(line === 2){

          this.lineThree += character;

        }


        if(line === 3){

          this.lineFour += character;

        }



        this.cd.detectChanges();



        index++;




        if(index >= text.length){


          clearInterval(interval);

          resolve();


        }



      },80);



    });



  }







  deleteLine(
    line:number
  ){


    return new Promise<void>((resolve)=>{


      let current = '';



      if(line === 0){

        current = this.lineOne;

      }


      if(line === 1){

        current = this.lineTwo;

      }


      if(line === 2){

        current = this.lineThree;

      }


      if(line === 3){

        current = this.lineFour;

      }





      const interval = setInterval(()=>{


        current = current.slice(0,-1);



        if(line === 0){

          this.lineOne = current;

        }


        if(line === 1){

          this.lineTwo = current;

        }


        if(line === 2){

          this.lineThree = current;

        }


        if(line === 3){

          this.lineFour = current;

        }



        this.cd.detectChanges();




        if(current.length === 0){


          clearInterval(interval);

          resolve();


        }



      },45);



    });


  }






  wait(time:number){


    return new Promise(resolve=>{


      setTimeout(resolve,time);


    });


  }



}