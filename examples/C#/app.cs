using System;
  
namespace Codefend {
      
     class c_CodefendExample {
          
        static void Main(string[] args) {
            Geeks l_Geeks = new Geeks();
            int l_count = 5;
            for (int l_i = 0; l_i < l_count; l_i++) {
                l_Geeks.f_display("Hello World\n");
            }
        }

        void f_display(int p_message) {
            Console.WriteLine(p_message);
        }
    }
}