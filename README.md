# CEC — Cursinho Educação e Cidadania

Site institucional do CEC, cursinho pré-vestibular gratuito da UFSCar Sorocaba.

## Rodando localmente

```bash
npm install
npm run dev
```

O site abre em `http://localhost:5173`.

## Outros comandos

```bash
npm run build    # gera a pasta dist/ para produção
npm run preview  # visualiza o build de produção localmente
```

## Estrutura

```
/
├── index.html
├── educadores.html
├── aprovados.html
├── doacoes.html
├── contato.html
├── processos-seletivos.html
├── src/
│   ├── css/        # estilos globais
│   └── js/         # scripts do site
└── public/
    └── img/edu/    # fotos dos educadores
```

## Adicionando foto de educador

Coloque a imagem em `public/img/edu/nome-do-educador.jpg` e substitua o `<img>` correspondente no card em `educadores.html`.
