"use client"
import Image from 'next/image';
import React, { ReactNode, useEffect, useState } from 'react'

const CollageEffect = ({elementsData}:{elementsData:{front:ReactNode,back:ReactNode}[]}) => {
    const [orientations,setOrientations]= useState(elementsData.map(()=>0))

    useEffect(() => {
        var lastTarget = "";
    
        function changeOrientation(event:any) {
          event.stopPropagation();
          //console.log(event.target);
          //console.log(event.currentTarget);
    
          var target = event.currentTarget || event.srcElement;
          if (target == lastTarget) {
            return;
          }
    
          lastTarget = target;
    
          var currentOrientation = target.getAttribute("data-orientation");
          var newOrientation = 1 - currentOrientation;
    
          target.dataset.orientation = newOrientation;
    
          
        }
        function randomRotate() {
          var widthClient = Math.floor(document.documentElement.clientWidth);
          var heightClient = Math.floor(document.documentElement.clientHeight);
    
          if (widthClient <= 640) {
            return;
          }
    
          var products = document.getElementsByClassName("cube");
          var numProducts = 0;
    
          if (products.length > 0) {
            for (var i = 0; i < products.length; i++) {
              //console.log(products[i]);
    
              if (
                getComputedStyle(products[i]).getPropertyValue("display") != "none"
              ) {
                //console.log(products[i].style.display);
    
                numProducts++;
              }
            }
    
            var randomNumber = Math.floor(Math.random() * numProducts);
    
            //console.log('Random Rotate: ' + numProducts + ' - ' + randomNumber);
    
            var currentOrientation:any =
              products[randomNumber].getAttribute("data-orientation");
            var newOrientation = 1 - currentOrientation;
    
            products[randomNumber].setAttribute("data-orientation", JSON.stringify(newOrientation));
    
            //t = setTimeout(randomRotate, 1000);
          }
        }
    
        var products = document.getElementsByClassName("cube");
    
        if (products.length > 0) {
          for (var i = 0; i < products.length; i++) {
            console.log(i);
            products[i].addEventListener("mouseover", function (event) {
              changeOrientation(event);
            });
          }
        }
    
        var t = setInterval(randomRotate, 4000);
      }, []);
  return (

<div  id="animationProductDiv">
   {elementsData.map((ele,i)=>{
    return <Cube key={i} data={ele} orientation={orientations[i]} onHover={()=>{setOrientations(prev=>{
      prev[i] =  1-prev[1]
      return prev
    })}} index={i}/>
   })}
  </div>
  )
}

const Cube = ({ data, onHover, orientation, index }:{ data:any, onHover:any, orientation:number, index:number }) => {
    return (
      <div
        id=""
        className="cube "
        data-orientation={orientation}
        onMouseEnter={onHover}
      >
        <div className="cubeFace cubeFaceFront">
          {data.front}
        </div>
        <div className="cubeFace cubeFaceBack">
         {data.back}
        </div>
        <div className="cubeFace cubeFaceRight"></div>
        <div className="cubeFace cubeFaceLeft"></div>
        <div className="cubeFace cubeFaceTop"></div>
        <div className="cubeFace cubeFaceBottom"></div>
      </div>
    );
  };
export default CollageEffect