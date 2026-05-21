        function showConfigCustomization() {
            const msg = '<strong>⚙️ How to Customize Call Center by Configuration</strong><br><br>' +
                '<strong>📍 Step 1: Navigate to the Module</strong><br>' +
                'Go to the module you want to customize. For example:<br>' +
                '<pre>cd /callcenter-code/call-center-order</pre><br>' +
                '<strong>📦 Step 2: Configure Yarn</strong><br>' +
                '<pre>yarn config set "strict-ssl" false</pre><br>' +
                '<strong>📥 Step 3: Install Dependencies</strong><br>' +
                '<pre>yarn install --update-checksums</pre><br>' +
                '<strong>🔧 Step 4: Update Server Config</strong><br>' +
                'Update app-config.json and overrides.json files to add prodserverconfig hostname as IP Address of host<br><br>' +
                '<strong>📂 Step 5: Create Custom Folder</strong><br>' +
                '<pre>packages/order-root-config/src/assets/custom</pre><br>' +
                '<strong>📝 Step 6: Create Custom JSON Files</strong><br>' +
                'Create files with same name as OOB files (e.g., search_fields.json)<br><br>' +
                '<div class="warning">OOB files location: /call-center-order/packages/order-shared/assets/call-center-order</div><br>' +
                '<strong>📋 Example: Payment Type Search Field</strong><br>' +
                '<img src="images/payment-type-example.png" alt="Payment Type Search Field JSON Example" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; display: block;"><br>' +
                '<strong>🚀 Step 7: Start Server</strong><br>' +
                '<pre>yarn start-app</pre><br>' +
                '<strong>🌐 Step 8: Access Application</strong><br>' +
                '<pre>https://9.30.188.206:6443/call-center/login</pre><br>' +
                '<div class="success">✅ Configuration Customization Complete!</div><br>' +
                '<strong>💡 Key Points:</strong><br>' +
                '• Custom files override OOB files<br>' +
                '• Maintain same JSON structure<br>' +
                '• Use insertAfter to position fields<br><br>' +
                '<strong>📚 Modules:</strong> order, return, customer, alert, hub';
            addBotMessage(msg);
        }

        function showDevEnvironmentSetup() {
            addBotMessage(`
                <strong>🛠️ Call Center Customisation Dev Environment Setup</strong><br><br>

                <strong>🔧 Step 1: Install DevToolkit</strong><br>
                Navigate to <code>/devtoolkit_docker/compose/om-compose.properties</code><br><br>

                Find the <code>AP_WAR_FILES</code> property and add <code>icc</code><br><br>

                Set property <code>CC_ENABLE="Y"</code><br><br>

                Run:<br>
                <pre>./om-compose.sh setup</pre><br>

                <div class="success">
                    ✅ Once Next-Gen Call Center is enabled in devtoolkit_docker, need to extract the Source Code to start the customisation.
                </div><br>

                <strong>📥 Step 2: Extract Code</strong><br>
                Navigate to <code>/devtoolkit_docker/compose-callcenter</code><br><br>

                Run:<br>
                <pre>./cc-compose.sh extract-callcenter-code</pre><br><br>

                <strong>📦 Step 3: Install Node.js</strong><br>
                Install Node.js Version 18 or later.<br>
                Download and install <strong>v18.20.6 (LTS)</strong> version.<br><br>
                
                <strong>Verify the Node.js version:</strong><br>
                <pre>node -v</pre><br>
                
                <strong>📦 Step 4: Install Yarn</strong><br>
                <pre>npm install --global yarn@1.22.22</pre><br>
                
                <strong>Verify the Yarn version:</strong><br>
                <pre>yarn -v</pre><br>
                
                <strong>📦 Step 5: Install Angular CLI</strong><br>
                <pre>npm install -g @angular/cli@18.2.14</pre><br>
                
                <strong>Verify Angular version:</strong><br>
                <pre>ng version</pre><br>
                
                <div class="warning">
                    <strong>⚠️ Permission Issue Fix:</strong><br>
                    While installing the Angular CLI you might get a permission issue.<br>
                    Change the permission for the specific folder by running:<br>
                    <pre>sudo chown -R $(whoami) /usr/local/lib/node_modules/</pre>
                </div>
                
                <div class="success">
                    ✅ <strong>Setup Complete!</strong><br>
                    Your development environment is now ready for Call Center customization.
                </div>
                
                <strong>💡 Next Steps:</strong><br>
                • Clone the repository<br>
                • Run <code>yarn install</code> to install dependencies<br>
                • Start development with <code>ng serve</code><br><br>
                
                <em>Need help with something else? Just ask!</em>
            `);
        }

        function showHelp() {
            addBotMessage(`
                <strong>📚 Help - How to Use OMS Assistant</strong><br><br>
                <strong>Available Commands:</strong><br>
                • "config customization" - Configuration guide<br>
                • "setup" - Environment setup<br>
                • "examples" - View examples<br>
                • "help" - Show this help<br><br>
                <em>Type your question or select a command!</em>
            `);
        }

        function showExamples() {
            addBotMessage(`
                <strong>📝 Example Requirements</strong><br><br>
                <strong>Component Examples:</strong><br>
                • "Add order-status component"<br>
                • "Create customer-profile component"<br><br>
                <strong>Service Examples:</strong><br>
                • "Add order-service"<br>
                • "Create payment-service"<br><br>
                <em>Try typing one of these examples!</em>
            `);
        }

        function toggleMashupSubMenu() {
            const menu = document.getElementById('mashupSubMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
        function toggleActionsSubMenu() {
            const menu = document.getElementById('actionsSubMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }


        function showMashupOptions() {
            addBotMessage(`
                <strong>🔌 Mashup Extensions</strong><br><br>
                Please select the type of mashup extension you want to implement:<br><br>
                <button onclick="sendQuickMessage('incremental mashup')" style="background:#0f62fe;color:white;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;margin-right:10px;margin-bottom:8px;">➕ Incremental Mashup</button>
                <button onclick="sendQuickMessage('override mashup')" style="background:#198038;color:white;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-size:14px;margin-bottom:8px;">🔄 Override Mashup</button><br><br>
                <strong>➕ Incremental Mashup</strong> — Add additional changes on top of OOB mashup<br>
                <strong>🔄 Override Mashup</strong> — Override the OOB mashup behavior completely
            `);
        }

        function makePreBlock(rawText) {
            var pre = document.createElement('pre');
            pre.textContent = rawText;
            return pre.outerHTML;
        }

        function showIncrementalMashup() {
            const xmlExample = makePreBlock(
'<Input>\n' +
'  <Order CustomerFirstName="" CustomerLastName="" CustomerEMailID="" CustomerPhoneNo="" CustomerPONo=""\n' +
'     CustomerZipCode="" DisplayLocalizedFieldInLocale="" DocumentType="" DraftOrderFlag="" FromOrderDate=""\n' +
'     HoldFlag="" CallingOrganizationCode="" MaximumRecords="" OrderName="" OrderNo="" ReadFromHistory=""\n' +
'     ToOrderDate="" OrderDateQryType="" EntryType="" SelectMethod="NO_LOCK">\n' +
'     <OrderStatus Status=""/>\n' +
'     <OrderHoldType Status="" StatusQryType="" HoldType="">\n' +
'     </OrderHoldType>\n' +
'     <OrderLine>\n' +
'        <OrderHoldType Status="" StatusQryType="" HoldType="">\n' +
'        </OrderHoldType>\n' +
'     </OrderLine>\n' +
'     <OrderBy>\n' +
'        <Attribute Name="" Desc=""></Attribute>\n' +
'     </OrderBy>\n' +
'     <PaymentMethod PaymentType=""/>\n' +
'  </Order>\n' +
'</Input>');

            addBotMessage(
                '<strong>&#10133; Incremental Mashup Extension</strong><br><br>' +
                '<div class="info">If you want to apply additional changes on top of the OOB mashup, choose Incremental Mashup option.</div><br>' +
                '<strong>&#128205; Step 1: Identify the Mashup</strong><br>' +
                'Identify the mashups which you want to extend.<br>' +
                'For example: <code>icc_order_search_results_mashups.xml</code><br><br>' +
                '<strong>&#128194; Step 2: Create Directory</strong><br>' +
                'Create a directory <code>/icc/webpages</code> under <code>/devtoolkit_docker/runtime/extensions</code>.<br>' +
                'Folder structure should be as follows:<br>' +
                '<pre>/runtime/extensions/icc/webpages</pre>' +
                '<strong>&#128269; Step 3: Find OOB Mashup</strong><br>' +
                'Find the OOB Mashup under:<br>' +
                '<pre>/devtoolkit_docker/runtime/repository/eardata/icc/war/mashupxmls/<sub-directories></pre>' +
                '<strong>&#128221; Step 4: Create Incremental Mashup File</strong><br>' +
                'Create a mashups file, suffix with <code>_incrementalmashups.xml</code><br>' +
                'For example: <code>icc_order_search_results_incrementalmashups.xml</code><br><br>' +
                '<strong>&#128203; Step 5: Copy OOB Content</strong><br>' +
                'Copy the content of existing mashups.xml to the extended mashups file:<br>' +
                '<code>icc_order_search_results_incrementalmashups.xml</code><br><br>' +
                '<strong>&#128193; Step 6: Place in Extensions Folder</strong><br>' +
                'Place the file into extensions folder as below:<br>' +
                '<pre>/runtime/extensions/icc/webpages/mashupxmls/icc_order_search_results_incrementalmashups.xml</pre>' +
                '<strong>&#9999;&#65039; Step 7: Add/Remove Attributes</strong><br>' +
                'Add or remove Attributes/Element in <code>icc_order_search_results_incrementalmashups.xml</code><br>' +
                'For example, here incremented <strong>PaymentType</strong> attribute in getOrderList input as follows for Order Search:<br>' +
                xmlExample +
                '<strong>&#128296; Step 8: Build Extension Jar</strong><br>' +
                'Goto your <code>devtoolkit_docker</code> and run:<br>' +
                '<pre>./runtime/bin/sci_ant.sh -f ./runtime/devtoolkit/devtoolkit_extensions.xml export</pre>' +
                '<strong>&#128640; Step 9: Deploy Extension Jar</strong><br>' +
                'Goto your <code>/devtoolkit_docker/compose</code> and run:<br>' +
                '<pre>./om-compose.sh update-extn /devtoolkit_docker/extensions.jar</pre>' +
                '<div class="success">&#9989; Incremental Mashup Extension applied successfully!</div>'
            );
        }

        function showOverrideMashup() {
            const xmlExample = makePreBlock(
'<API FlowName="ExtnGetCompleteCustomerList">\n' +
'    <Input>\n' +
'        <Customer CallingOrganizationCode="" CustomerType=""\n' +
'            DisplayLocalizedFieldInLocale="xml:CurrentUser:/User/@Localecode" MaximumRecords="10">\n' +
'            <BuyerOrganization OrganizationName="">\n' +
'                <ComplexQuery>\n' +
'                    <Or>\n' +
'                        <Exp Name="" QryType="" Value=""/>\n' +
'                    </Or>\n' +
'                </ComplexQuery>\n' +
'            </BuyerOrganization>\n' +
'            <CustomerContactList>\n' +
'                <CustomerContact>\n' +
'                    <ComplexQuery>\n' +
'                        <Or>\n' +
'                            <Exp Name="" QryType="" Value=""/>\n' +
'                        </Or>\n' +
'                    </ComplexQuery>\n' +
'                </CustomerContact>\n' +
'            </CustomerContactList>\n' +
'        </Customer>\n' +
'    </Input>\n' +
'</API>');

            addBotMessage(
                '<strong>&#128260; Override Mashup Extension</strong><br><br>' +
                '<div class="info">If you want to override the OOB mashup behavior completely, choose Override Mashup option.</div><br>' +
                '<strong>&#128205; Step 1: Identify the Mashup</strong><br>' +
                'Identify the mashups which you want to extend.<br>' +
                'For example: <code>icc_customer_identification_mashups.xml</code><br><br>' +
                '<strong>&#128194; Step 2: Create Directory</strong><br>' +
                'Create a directory <code>/icc/webpages</code> under <code>/devtoolkit_docker/runtime/extensions</code>.<br>' +
                'Folder structure should be as follows:<br>' +
                '<pre>/runtime/extensions/icc/webpages</pre>' +
                '<strong>&#128269; Step 3: Find OOB Mashup</strong><br>' +
                'Find the OOB Mashup under:<br>' +
                '<pre>/devtoolkit_docker/runtime/repository/eardata/icc/war/mashupxmls/<sub-directories></pre>' +
                '<strong>&#128221; Step 4: Create Override Mashup File</strong><br>' +
                'Create a mashups file, suffix with <code>_overridemashups.xml</code><br>' +
                'For example: <code>icc_customer_identification_overridemashups.xml</code><br><br>' +
                '<strong>&#128203; Step 5: Copy OOB Content</strong><br>' +
                'Copy the content of existing mashups.xml to the extended mashups file:<br>' +
                '<code>icc_customer_identification_overridemashups.xml</code><br><br>' +
                '<strong>&#128193; Step 6: Place in Extensions Folder</strong><br>' +
                'Place the file into extensions folder as below:<br>' +
                '<pre>/runtime/extensions/icc/webpages/mashupxmls/icc_customer_identification_overridemashups.xml</pre>' +
                '<strong>&#9999;&#65039; Step 7: Add/Remove Attributes</strong><br>' +
                'Add or remove Attributes/Element in <code>icc_customer_identification_overridemashups.xml</code><br>' +
                'For example, here replaced <strong>getCustomerList</strong> API to Service <strong>ExtnGetCompleteCustomerList</strong> by passing <code>FlowName="ExtnGetCompleteCustomerList"</code> for Customer Search:<br>' +
                xmlExample +
                '<strong>&#128296; Step 8: Build Extension Jar</strong><br>' +
                'Goto your <code>devtoolkit_docker</code> and run:<br>' +
                '<pre>./runtime/bin/sci_ant.sh -f ./runtime/devtoolkit/devtoolkit_extensions.xml export</pre>' +
                '<strong>&#128640; Step 9: Deploy Extension Jar</strong><br>' +
                'Goto your <code>/devtoolkit_docker/compose</code> and run:<br>' +
                '<pre>./om-compose.sh update-extn /devtoolkit_docker/extensions.jar</pre>' +
                '<div class="success">&#9989; Override Mashup Extension applied successfully!</div>'
            );
        }

        function showPlannedEnhancements() {
            addBotMessage(`
                <strong>🚀 Planned Enhancements for Next-Gen Call-Center Customization Assistant</strong><br><br>

                <div class="info">
                    📌 The following enhancements are planned for future releases of this assistant.
                </div><br>

                <strong>📦 1. Additional Use Cases (Call-Center)</strong><br>
                • <strong>Shared Component Customizations</strong> — Customize shared/common components across modules<br>
                • <strong>Home Portlet Customizations</strong> — Add/modify portlets on the Call Center home screen<br>
                • <strong>Custom Actions</strong> — Implement custom action buttons and workflows<br>
                • <strong>Custom Application/Route Implementation</strong> — Add new routes and micro-frontend applications<br><br>

                <strong>🎯 2. Smart File Suggestion Engine</strong><br>
                • Suggest the <strong>specific files</strong> that need to be changed for a given customization requirement<br>
                • Auto-detect impacted components, services, routes, and config files<br>
                • Provide diff-style code snippets for each file change<br><br>

                <strong>🏪 3. OrderHub Customizations</strong><br>
                • Guidance for Next-Gen OrderHub UI customizations<br>
                • Component overrides, layout changes, and workflow customizations<br>
                • OrderHub-specific configuration and environment setup<br><br>

                <strong>🛒 4. Store Next-Gen Customizations</strong><br>
                • Guidance for Store Next-Gen UI customizations<br>
                • Store-specific component and portlet customizations<br>
                • Store workflow and routing customizations<br><br>

                <strong>🤖 5. AI-Powered Assistance</strong><br>
                • Integration with IBM watsonx for intelligent, context-aware responses<br>
                • Natural language understanding for complex customization queries<br>
                • Code generation and validation support<br><br>

                <div class="success">
                    ✅ Your feedback helps prioritize these enhancements! Use the 👍/👎 buttons to share your thoughts.
                </div>
            `);
        }

        function showComponentCustomization() {
            addBotMessage(`
                <strong>🔧 Call Center Features Component Customization</strong><br><br>
                
                <strong>📍 Step 1: Navigate to Module</strong><br>
                Go to the module that you want to customize<br>
                For example: If you want to customize the order module, then go to the call-center-order:<br>
                <pre>cd /callcenter-code/call-center-order</pre><br>
                
                <strong>🔒 Step 2: Configure SSL</strong><br>
                Run the following command to set strict-ssl to false<br>
                <pre>yarn config set "strict-ssl" false</pre><br>
                
                <strong>📦 Step 3: Install Dependencies</strong><br>
                Run the following command to install all the dependencies for the module.<br>
                <pre>yarn install --update-checksums</pre><br>
                
                <strong>⚙️ Step 4: Update Server Config</strong><br>
                Make sure app-config.json and overrides.json files has prodserverconfig hostname as IP Address of host<br><br>
                
                <strong>🎨 Start the Customization</strong><br><br>
                
                <strong>Example: Customize Order Summary Component</strong><br><br>
                
                <strong>1️⃣ Copy Component Folder</strong><br>
                Copy order-summary folder from:<br>
                <code>callcenter-code/call-center-order/packages/order-details/src/app/features/order/order-summary</code><br>
                to:<br>
                <code>callcenter-code/call-center-order/packages/order-details/src-custom/app/features/order/order-summary</code><br><br>
                
                <strong>2️⃣ Enable Routes for Customization</strong><br>
                In overrides.json, add:<br>
                <pre>"order-details": { "runAsCustomization": true }</pre><br>
                
                <strong>3️⃣ Update angular.json</strong><br>
                In the angular.json file, find:<br>
                <code>projects > order-details > architect > build > configurations > merged > assets</code><br><br>
                Replace with:<br>
                <pre>"assets": [
  {
    "glob": "**",
    "input": "packages/order-details/src-merged/assets",
    "output": "assets"
  },
  {
    "glob": "*.json",
    "input": "packages/order-details/src-merged/assets/call-center-order",
    "output": "assets/order-details"
  },
  {
    "glob": "**",
    "input": "node_modules/@buc/svc-angular/assets",
    "output": "assets"
  },
  {
    "glob": "**",
    "input": "node_modules/@buc/common-components/assets",
    "output": "assets"
  }
]</pre><br>
                Also replace in:<br>
                <code>projects > order-details > architect > build > configurations > merged-prod > assets</code><br><br>
                
                <strong>4️⃣ Enable Environment for Customization</strong><br>
                Copy environments folder from:<br>
                <code>callcenter-code/call-center-order/packages/order-details/src/environments</code><br>
                to:<br>
                <code>callcenter-code/call-center-order/packages/order-details/src-custom/environments</code><br><br>
                
                Add in environment.ts and environment.prod.ts:<br>
                <pre>environment.customization = true</pre><br>
                
                <strong>5️⃣ Update Dependencies</strong><br>
                Make sure all the required import dependencies are updated or added in order-summary.component.ts to avoid compilation errors.<br><br>
                
                <strong>6️⃣ Apply Customizations</strong><br>
                Start applying customizations in:<br>
                <code>callcenter-code/call-center-order/packages/order-details/src-custom/app/features/order/order-summary</code><br><br>
                
                <strong>🚀 Step 5: Start Server</strong><br>
                Goto callcenter-code/call-center-order/ and start the server<br>
                <pre>yarn start-app</pre><br>
                
                <em>Need help with something else? Just ask!</em>
            `);
        }
        function showSharedComponentCustomization() {
            addBotMessage(`
                <strong>🧩 Shared Component Customization</strong><br><br>
                
                <strong>📋 Overview:</strong><br>
                Shared components are reusable components used across multiple modules in Call Center. This guide shows how to customize them.<br><br>
                
                <strong>Example: Customizing Fulfillment Group Details Component</strong><br><br>
               Since the fulfillment group details component is a child component of the Fulfillment Group tab, both fulfillment-group-tab and fulfillment-group-details need to be copied from src to src-custom to apply the customizations.<br><br>
                <strong>1️⃣ Copy Shared Component Folder</strong><br>
                Copy <code>fulfillment-group-tab</code> folder from:<br>
                <code>call-center-order/packages/src/lib/components</code><br>
                to:<br>
                <code>call-center-order/packages/order-details/src-custom/app/features/order</code><br><br>
                
                <strong>2️⃣ Fix Dependencies</strong><br>
                Add all required imports in:<br>
                • <code>fulfillment-group-tab.component.ts</code><br>
                • <code>fulfillment-group-details.component.ts</code><br><br>
                
                <strong>3️⃣ Update Fulfillment Group Tab Component</strong><br>
                In <code>fulfillment-group-tab.component.ts</code>:<br>
                <pre>@Component({
  selector: 'call-center-fulfillment-group-tab[extn]',
  ...
})
export class ExtnFulfillmentGroupTabComponent {
  ...
}</pre><br>
                
                <strong>4️⃣ Update Reference in Order Summary</strong><br>
                In <code>order-summary.component.html</code>, update:<br>
                <pre>&lt;call-center-fulfillment-group-tab extn&gt;&lt;/call-center-fulfillment-group-tab&gt;</pre><br>
                
                <strong>5️⃣ Update Fulfillment Group Details Component</strong><br>
                In <code>fulfillment-group-details.component.ts</code>:<br>
                <pre>@Component({
  selector: 'call-center-fulfillment-group-details[extn]',
  ...
})
export class ExtnFulfillmentGroupDetailsComponent {
  ...
}</pre><br>
                
                <strong>6️⃣ Update Reference in Fulfillment Group Tab</strong><br>
                In <code>fulfillment-group-tab.component.html</code>, update:<br>
                <pre>&lt;call-center-fulfillment-group-details extn&gt;&lt;/call-center-fulfillment-group-details&gt;</pre><br>
                
                <strong>7️⃣ Register Components in App Customization</strong><br>
                Update <code>app-customization.impl.ts</code>:<br>
                <pre>export class AppCustomizationImpl {
  static readonly components = [
    ExtnFulfillmentGroupTabComponent,
    ExtnFulfillmentGroupDetailsComponent
  ];
  static readonly providers = [];
  static readonly imports = [
    BucCommonComponentsModule,
    BucFeatureComponentsModule
  ];
}</pre><br>
                
                <strong>8️⃣ Verify overrides.json</strong><br>
                Ensure <code>overrides.json</code> has:<br>
                <pre>"order-details": {
  "runAsCustomization": true
}</pre><br>
                
                <strong>9️⃣ Update angular.json Assets Array</strong><br>
                In <code>angular.json</code>, update the assets array for both <code>merged</code> and <code>merged-prod</code> configurations under <code>order-details</code>:<br><br>
                
                <strong>Location:</strong><br>
                • <code>projects > order-details > architect > build > configurations > merged > assets</code><br>
                • <code>projects > order-details > architect > build > configurations > merged-prod > assets</code><br><br>
                
                <strong>Update with:</strong><br>
                <pre>"assets": [
  {
    "glob": "**",
    "input": "packages/order-details/src-merged/assets",
    "output": "assets"
  },
  {
    "glob": "*.json",
    "input": "packages/order-details/src-merged/assets/call-center-order",
    "output": "assets/order-details"
  },
  {
    "glob": "**",
    "input": "node_modules/@buc/svc-angular/assets",
    "output": "assets"
  },
  {
    "glob": "**",
    "input": "node_modules/@buc/common-components/assets",
    "output": "assets"
  }
]</pre><br>
                
                <div class="info">
                    ℹ️ <strong>Note:</strong> This assets array configuration must be applied to BOTH <code>merged</code> and <code>merged-prod</code> objects under the <code>order-details</code>.
                </div><br>
                
                <strong>🔟 Run Development Server</strong><br>
                <pre>yarn start-app</pre><br>
                
                <div class="success">
                    ✅ <strong>Shared Component Customization Complete!</strong><br>
                    Your customized shared component is now ready to use.
                </div><br>
                
                <strong>💡 Key Points:</strong><br>
                • Always use <code>[extn]</code> selector for custom components<br>
                • Update all component references in templates<br>
                • Register components in app-customization.impl.ts<br>
                • Fix all import dependencies to avoid compilation errors<br><br>
                
                <em>Need help with something else? Just ask!</em>
            `);
        }


        function showHomePortletCustomization() {
            addBotMessage(`
                <strong>🏠 Home Portlet Customization</strong><br><br>
                
                <strong>📋 Overview:</strong><br>
                Customize home portlets in Call Center to extend or modify the home page widgets.<br><br>
                
                <strong>Part 1: Local Development Setup</strong><br><br>
                
                <strong>1️⃣ Create Widget Configuration</strong><br>
                Go to <code>call-center-code/call-center-hub</code> and create <code>cc-home-custom-widget-config.json</code>:<br>
                <pre>{
  "widgets": [
    {
      "id": "search-order",
      "fixed": false,
      "configuration": {},
      "colSpan": 1,
      "sequence": "1",
      "extensionType": "CODE",
      "resourceIds": ["ICC000014"]
    }
  ]
}</pre><br>
                <div class="info">
                    ℹ️ <strong>extensionType</strong> can be <code>CONFIG</code> or <code>CODE</code> based on your use case.
                </div><br>
                
                <strong>2️⃣ Create Import Map</strong><br>
                Go to <code>call-center-code/call-center-hub/assets</code> and create <code>import-map.json</code>:<br>
                <pre>{
  "imports": {
    "custom-home-portlet": "https://localhost:9200/call-center-home/custom-home-portlet/main.js"
  }
}</pre><br>
                
                <strong>3️⃣ Modify Search Order Widget</strong><br>
                Go to <code>DTK/callcenter-code/call-center-custom/libs/cc-components/src/lib/modules/cc-home-components/search-order-widget</code><br>
                Modify <code>search-order-widget.component.html</code> with your customizations.<br><br>
                
                <strong>4️⃣ Copy Configuration Files</strong><br>
                Copy <code>cc-home-custom-widget-config.json</code> to:<br>
                <code>DTK/callcenter-code/call-center-hub/assets</code><br><br>
                
                Copy <code>import-map.json</code> to:<br>
                <code>DTK/callcenter-code/call-center-hub/assets</code><br><br>
                
                <strong>5️⃣ Modify App Component</strong><br>
                Go to <code>callcenter-code/call-center-custom/custom-home-portlet/src/app</code><br>
                Modify <code>app-component.html</code> and add:<br>
                <pre>&lt;!-- Customize OOTB and new portlets here --&gt;
&lt;div *ngIf="homePortletId==='search-order'"&gt;
   &lt;buc-cc-search-order-widget&gt;&lt;/buc-cc-search-order-widget&gt; 
&lt;/div&gt;</pre><br>
                
                <strong>6️⃣ Add BucNotificationService Provider</strong><br>
                File: <code>call-center-custom/libs/cc-components/src/lib/modules/cc-home-components/search-order-widget/search-order-widget.component.ts</code><br>
                <pre>@Component({
  selector: 'buc-cc-search-order-widget',
  templateUrl: './search-order-widget.component.html',
  styleUrls: ['./search-order-widget.component.scss'],
  providers: [BucNotificationService]
})</pre><br>
                
                <strong>7️⃣ Link Custom Module to Components Library</strong><br>
                Go to <code>call-center-custom</code> directory:<br>
                <pre>yarn install</pre><br>
                
                Run development build:<br>
                <pre>yarn cc-components:dev</pre>
                <div class="info">The build continues to run and captures file changes.</div><br>
                
                In <code>call-center-custom/dist/libs/cc-components</code>, run:<br>
                <pre>yarn link</pre>
                <div class="success">Success message: Registered "@buc/cc-components"</div><br>
                
                Link the custom module from <code>call-center-custom</code>:<br>
                <pre>yarn link @buc/cc-components</pre><br>
                
                <strong>8️⃣ Run Development Server</strong><br>
                <pre>yarn start-home</pre>
                Test locally on port 6443.<br><br>
                
                <strong>Part 2: Deployment</strong><br><br>
                
                <strong>1️⃣ Prepare Configuration</strong><br>
                • Remove <code>import-map.json</code> from <code>DTK/call-center-code/call-center-hub/assets</code><br>
                • Copy <code>cc-home-custom-widget-config.json</code> to <code>DTK/callcenter-code/call-center-hub</code><br><br>
                
                <strong>2️⃣ Update package.json</strong><br>
                In <code>call-center-custom/package.json</code>, add:<br>
                <pre>"package-customization": "yarn cc-components:prod && yarn build && yarn build-home",
"postinstall": "yarn link @buc/cc-components"</pre><br>
                
                <strong>3️⃣ Build UI Extension JAR</strong><br>
                From <code>container-build</code> folder:<br>
                <pre>./build-customization.sh build-ui call-center-custom
./build-customization.sh package-jar call-center-custom</pre><br>
                
                <strong>4️⃣ Build Custom Image</strong><br>
                Copy package jar to <code>DTK/callcenter-code/container-build/packagejar</code><br><br>
                
                Execute:<br>
                <pre>./build-customization.sh build-image-from-jar \\
  packagejar/call-center-ext_2025_02_21_13_20_53.jar \\
  cust-img-1707 1707</pre><br>
                
                <strong>5️⃣ Update Docker Compose Properties</strong><br>
                In <code>DTK/compose-callcenter/docker/cc-docker-compose.properties</code>:<br>
                <pre>CC_EXT_CUSTOM_IMAGE="cust-img-1707"
CC_EXT_CUSTOM_TAG="1707"</pre><br>
                
                <strong>6️⃣ Deploy Custom Call Center</strong><br>
                Go to <code>DTK/compose-callcenter</code>:<br>
                <pre>./cc-compose.sh setup-callcenter-custom</pre><br>
                
                <strong>7️⃣ Validate Changes</strong><br>
                Access on port 6445 and validate your customizations.<br><br>
                
                <div class="success">
                    ✅ <strong>Home Portlet Customization Complete!</strong><br>
                    Your custom home portlet is now deployed and accessible.
                </div><br>
                
                <strong>💡 Key Points:</strong><br>
                • Custom widgets override OOB widgets<br>
                • Use cc-home-custom-widget-config.json for configuration<br>
                • Link custom module before running dev server<br>
                • Test locally before deployment<br><br>
                
                <em>Need help with something else? Just ask!</em>
            `);
        }

        async function showCustomizeExistingAction() {
            // Show loading message
            addBotMessage('⏳ Loading guide...');
            
            // Fetch guide from API
            const html = await fetchGuide('customize-existing-action');
            
            // Replace loading message with actual content
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }

        async function showConfigCustomization() {
            addBotMessage('⏳ Loading guide...');
            const html = await fetchGuide('config-customization');
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }

        // Keep the old function as fallback (commented out for reference)
        /*
        */

        async function showCustomActionWithConfig() {
            addBotMessage('⏳ Loading guide...');
            const html = await fetchGuide('custom-action-with-config');
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }

        async function showCustomActionWithCode() {
            addBotMessage('⏳ Loading guide...');
            const html = await fetchGuide('custom-action-with-code');
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }
        // Troubleshooting guides - fetched from API
        async function showTroubleshootBlankPage() {
            addBotMessage('⏳ Loading troubleshooting guide...');
            const html = await fetchGuide('troubleshoot-blank-page');
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }

        async function showTroubleshootDuplicatePopups() {
            addBotMessage('⏳ Loading troubleshooting guide...');
            const html = await fetchGuide('troubleshoot-duplicate-popups');
            const messages = document.querySelectorAll('.message.bot');
            const lastMessage = messages[messages.length - 1];
            const contentDiv = lastMessage.querySelector('.message-content');
            contentDiv.innerHTML = html;
        }


        // ============================================================
        // FEEDBACK SYSTEM - Like/Dislike & Feedback
        // ============================================================

