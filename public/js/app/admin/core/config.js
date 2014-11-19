var config = {
	router: {
		base: '/admin/',
		modulesContainer: '#moduleContent',
		modules: [
			{
				name: 'dashboard',
				path: 'js/app/admin/modules/main/'
			},
			{
				name: 'encyclopedia-category',
				path: 'js/app/admin/modules/category/'
			},
			{
				name: 'encyclopedia-article',
				path: 'js/app/admin/modules/articles/'
			},
			{
				name: 'encyclopedia-articleType',
				path: 'js/app/admin/modules/articleTypes/'
			},
			{
				name: 'faq',
				path: 'js/app/admin/modules/faqs/'
			},
			{
				name: 'consultations',
				path: 'js/app/admin/modules/consultations/'
			},
			{
				name: 'clients',
				path: 'js/app/admin/modules/clients/'
			},
			{
				name: 'productAges',
				path: 'js/app/admin/modules/productAges/'
			},
			{
				name: 'products',
				path: 'js/app/admin/modules/products/'
			},
			{
				name: 'ranks',
				path: 'js/app/admin/modules/ranks/'
			},
			{
				name: 'tmpRemoveUser',
				path: 'js/app/admin/modules/tmpRemoveUser/'
			}
		]
	}
};

export default config;