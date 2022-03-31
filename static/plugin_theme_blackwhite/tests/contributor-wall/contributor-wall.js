let contributors_wall_css_script = `
	<style type="text/css">
		table tr.contributor.l1 td {
			font-size: 0.9em;
			color: #676767;
		}
		table tr.contributor.l2 td {
			font-size: 1.05em;
			color: #a89a3a;
		}
		table tr.contributor.l3 td {
			font-size: 1.3em;
			color: navy;'
		}
		table tr.contributor.l4 td {
			font-size: 1.6em;
			color: #632500;
			font-weight: bold;'
		}
	</style>
`;

let contributors_wall = {
	'settings': {
		'currency': 'CFA',
		'selectors': {
			'container': '#wpneo-tab-baker_list',
			'contributor': {
				'row': 'table tr',
				'name_cell': 'td',
				'amount_cell': 'td+td',
				'date_cell': 'td+td+td',
			}
		},
		'css_class': {
			'contributor_plh': 'contributor l[level]',
		},
		'demo': {
			'qarg':	'contributor-wall-demo',		
			'amounts':[0, 250000, 2500000, 150000, 1000, 1000, 55000, 15000, 60000, 10000, 5000, 20000],	
		}
	},
	'contributor': {
		'get_level': (amount) => {
			let l = parseInt(Math.log10(amount) - 2)
			l = l<1 ? 1 : (l>4 ? 4 : l);
			return l 
		},
	},
	'common': {
		'qs': (key) =>  {
			/* src: https://stackoverflow.com/questions/7731778/get-query-string-parameters-url-values-with-jquery-javascript-querystring*/
		    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
		    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
		    if(match){
		    	return [match, decodeURIComponent(match[1].replace(/\+/g, " "))];
		    }
		},
	},

	'exec': () => {
		let c_w = contributors_wall;

		let currency = c_w.settings.currency;
		let sels = c_w.settings.selectors;
		let contr_sels = c_w.settings.selectors.contributor;
		let contributor_row_sel = `${sels.container} ${contr_sels.row}`;
		let contrib_o = c_w.contributor;
		let contrib_class_plh = c_w.settings.css_class.contributor_plh;

		let common_o = c_w.common;

		let demo_o = c_w.settings.demo;
		const demo_qarg = common_o.qs(demo_o.qarg)
		const do_demo = demo_qarg && demo_qarg[1] && parseInt(demo_qarg[1]) != 0; 

		jQuery(contributors_wall_css_script).insertBefore(sels.container);


		jQuery(contributor_row_sel).each(function(_index){
			let cells = jQuery(this).find('td');
			if(cells.length){
				let amount = parseInt(jQuery(cells[1]).text().replace(currency, ''));
				if(do_demo && _index<demo_o.amounts.length){
					let html = cells[1].innerHTML;
					html = html.replace(amount, demo_o.amounts[_index]);
					cells[1].innerHTML = html;

					amount = demo_o.amounts[_index]
				}

				let level = contrib_o.get_level(amount);

				jQuery(this).addClass(contrib_class_plh.replace('[level]', level));
			} else {
				console.log(`td cells not found (if index==0: th cells [index=${_index}])`)
			}
		});		
	},
};


jQuery(document).ready(function(){
	contributors_wall.exec();
})
