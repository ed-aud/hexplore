Rails.application.routes.draw do
  devise_for :users

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  root to: "pages#home"
  get "map", to: "pages#map", as: :map
  get "about", to: "pages#about", as: :about

  # resources :pages, only:
  resources :hexagons, only: %i[index show create new] do
    resources :hives, only: %i[new create]
  end

  resources :hives, only: %i[index show edit update destroy]
  resources :questions, only: %i[index create]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"
end
