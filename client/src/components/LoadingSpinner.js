import React from 'react';

export default function LoadingSpinner() {
  return (
    <div class="preloader-wrapper active">
      <div class="spinner-layer spinner-red-only">
        <div class="circle-clipper left">
          <div class="circle" />
        </div>
        <div class="gap-patch">
          <div class="circle" />
        </div>
        <div class="circle-clipper right">
          <div class="circle" />
        </div>
      </div>
    </div>
  );
}
